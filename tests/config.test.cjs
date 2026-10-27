const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../www/styles.js'), 'utf8');

async function start(config, states = {}, ok = true) {
  const elements = [], intervals = [], requests = [];
  const location = {pathname: '/dashboard/home', href: 'http://ha.test/dashboard/home'};
  const video = {paused: true, play: () => Promise.resolve(), pause() {}, remove() {}, removeAttribute() {}, load() {}};
  const document = {
    readyState: 'complete', hidden: false,
    createElement: tag => tag === 'video' ? video : {remove() {}},
    head: {append: el => elements.push(el)}, body: {prepend: el => elements.push(el)},
    querySelector: () => ({hass: {states}}), getElementById: id => elements.find(el => el.id === id),
    addEventListener() {}, removeEventListener() {},
  };
  const window = {location, addEventListener() {}, removeEventListener() {}};
  const context = vm.createContext({window, location, document, navigator: {userAgent: 'Desktop'},
    console: {info() {}, warn() {}, debug() {}}, URL, AbortController, performance,
    setInterval: (fn, ms) => {intervals.push(ms); return intervals.length;}, clearInterval() {},
    setTimeout: () => 1, clearTimeout() {},
    fetch: async (url, options) => {requests.push({url, options}); return {ok, json: async () => config};},
  });
  vm.runInContext(source, context);
  await new Promise(resolve => setImmediate(resolve));
  return {window, video, context, elements, intervals, requests};
}

test('external settings control entity, local paths, period and weather lists', async () => {
  const app = await start({settings: {weatherEntity: 'weather.garden', weatherUseLocal: true,
    localVideoPath: '/local/my-videos/', videoSwitchPeriod: 42}, videoFiles: {sunny: ['sun.webm']}},
    {'weather.garden': {state: 'sunny'}});
  assert.equal(app.video.src, 'http://ha.test/local/my-videos/sun.webm');
  assert.equal(app.intervals.at(-1), 42000);
  assert.equal(app.requests[0].url, '/local/animated_backgrounds/config.json');
  assert.equal(app.requests[0].options.cache, 'no-cache');
  assert.equal(app.window.haAnimatedBackgrounds.status.configState, 'loaded');
});

test('custom helpers override JSON defaults and can select the remote weather path', async () => {
  const app = await start({settings: {weatherControl: false, weatherUseLocal: true,
    weatherControlHelper: 'input_boolean.weather', weatherUseLocalHelper: 'input_boolean.local',
    videoSwitchPeriodHelper: 'input_number.period', flixelVideoPath: 'https://video.test'},
    videoFiles: {sunny: ['sun.mp4']}}, {'weather.forecast_home': {state: 'sunny'},
    'input_boolean.weather': {state: 'on'}, 'input_boolean.local': {state: 'off'},
    'input_number.period': {state: '25'}});
  assert.equal(app.video.src, 'https://video.test/sun.mp4');
  assert.equal(app.intervals.at(-1), 25000);
});

test('old videoFiles-only configurations still work; duplicate loading is harmless', async () => {
  const app = await start({videoFiles: {random: ['old.webm']}});
  assert.equal(app.video.src, 'http://ha.test/local/animated_backgrounds/old.webm');
  vm.runInContext(source, app.context);
  assert.equal(app.elements.length, 2);
  assert.equal(app.requests.length, 1);
});

test('invalid settings retain defaults while valid file lists remain usable', async () => {
  const app = await start({settings: {weatherEntity: 5, videoSwitchPeriod: -5,
    weatherControl: 'false', localVideoPath: null}, videoFiles: {random: [false, '', 'fallback.mp4']}});
  assert.equal(app.video.src, 'http://ha.test/local/animated_backgrounds/fallback.mp4');
  assert.equal(app.intervals[0], 180000);
});

test('missing optional config does not block initialization', async () => {
  const app = await start(null, {}, false);
  assert.equal(app.window.haAnimatedBackgrounds.status.initialized, true);
  assert.equal(app.window.haAnimatedBackgrounds.status.configState, 'defaults');
  assert.ok(app.video.src.startsWith('http://ha.test/local/animated_backgrounds/'));
});
