(() => {
'use strict';
if (window.haAnimatedBackgrounds) return;
console.info(
    '%c  ANIMATED-BACKGROUNDS  %c  version 1.6.0 (Universal)  %c  by dreimer1986 ',
             'color: orange; font-weight: bold; background: black',
             'color: white; font-weight: bold; background: dimgray',
             'color: white; font-weight: bold; background: rgb(71, 170, 238)',
);

// ==========================================
// CONFIGURATION
// ==========================================
const weatherEntity_ = "weather.forecast_home";
const localVideoPath_ = "/local/animated_backgrounds";
const flixelVideoPath_ = "https://cdn.flixel.com/flixel";

// Default settings (Used if Helpers are empty or unavailable)
let weatherControl_ = true;
let weatherUseLocal_ = false;
let videoSwitchPeriod_ = 180;

// ==========================================
// HOME ASSISTANT HELPERS
// ==========================================
const weatherControlHelper_ = "input_boolean.animated_backgrounds_weather_control";
const weatherUseLocalHelper_ = "input_boolean.animated_backgrounds_use_local";
const videoSwitchPeriodHelper_ = "input_number.animated_backgrounds_video_switch_period";

// Settings for forcing specific devices into single frame static image mode
const slowDeviceUserAgent = "Kindle";
const lowPowerMode = false;

// ==========================================
// DEFAULT FILE LISTS (Overridden if config.json exists)
// ==========================================
let videoFiles = {
    "random": ['1.webm', '2.webm', '3.webm', '4.webm', '5.webm', '6.webm', '7.webm', '8.webm', '9.webm', '10.webm', '11.webm', '12.webm', '13.webm', '14.webm', '15.webm', '16.webm', '17.webm', '18.webm', '19.webm', '20.webm', '21.webm', '22.webm', '23.webm', '24.webm', '25.webm', '26.webm', '27.webm', '28.webm', '29.webm', '30.webm', '31.webm', '32.webm', '33.webm', '34.webm', '35.webm', '36.webm', '37.webm', '38.webm', '39.webm', '40.webm', '41.webm', '42.webm', '43.webm', '44.webm', '45.webm', '46.webm', '47.webm', '48.webm', '49.webm', '50.webm', '51.webm', '52.webm', '53.webm', '54.webm', '55.webm', '56.webm', '57.webm', '58.webm', '59.webm', '60.webm', '61.webm', '62.webm', '63.webm', '64.webm', '65.webm', '66.webm', '67.webm', '68.webm', '69.webm', '70.webm', '71.webm', '72.webm', '73.webm', '74.webm', '75.webm', '76.webm', '77.webm', '78.webm', '79.webm', '80.webm', '81.webm', '82.webm', '83.webm'],

    // Weather states
    "clear-night": ['x9dr8caygivq5secll7i.hd.mp4', 'v26zyfd6yf0r33s46vpe.hd.mp4', 'ypy8bw9fgw1zv2b4htp2.hd.mp4', 'rosz2gi676xhkiw1ut6i.hd.mp4', 'x5rxll400y2um2xe677c.hd.mp4'],
    "cloudy": ['e95h5cqyvhnrk4ytqt4q.hd.mp4', 'l2bjw34wnusyf5q2qq3p.hd.mp4', 'rrgta099ulami3zb9fd2.hd.mp4'],
    "fog": ['vwqzlk4turo2449be9uf.hd.mp4', '5363uhabodwwrzgnq6vx.hd.mp4', '4dbfz329lqn0gzft14l.hd.mp4', 'surn8g651ok6j0hx43sy.hd.mp4', '1xgcgyb68b15ysz30gw9.hd.mp4', 'vabb5tnx2psqf1221ue9.hd.mp4'],
    "hail": ['Hail1.mp4', 'Hail2.mp4', 'Hail3.mp4'],
    "lightning": ['sbk5sc03j7vay52r3e4o.hd.mp4', 'chrgj6raf5q3s6y2so7z.hd.mp4'],
    "lightning-rainy": ['sbk5sc03j7vay52r3e4o.hd.mp4', 'chrgj6raf5q3s6y2so7z.hd.mp4'],
    "partlycloudy": ['13e0s6coh6ayapvdyqnv.hd.mp4', 'aorl3skmssy7udwopk22.hd.mp4', 'qed6wvf2igukiioykg3r.hd.mp4', '3rd72eezaj6d23ahlo7y.hd.mp4', '9m11gd43m6qn3y93ntzp.hd.mp4', 'hrkw2m8eofib9sk7t1v2.hd.mp4'],
    "pouring": ['qti3s5st0srowd9krhcw.hd.mp4', 'f0w23bd0enxur5ff0bxz.hd.mp4', '2qmg1xgcswq79lxu09rl.hd.mp4', 'guwb10mfddctfvwioaex.hd.mp4', '5y73ml3xqz6drbuzja1e.hd.mp4'],
    "rainy": ['qti3s5st0srowd9krhcw.hd.mp4', 'f0w23bd0enxur5ff0bxz.hd.mp4', '2qmg1xgcswq79lxu09rl.hd.mp4', 'guwb10mfddctfvwioaex.hd.mp4', '5y73ml3xqz6drbuzja1e.hd.mp4'],
    "snowy": ['on3ysblo5hzdmrhv1kwh.hd.mp4', 'psi1hhbsshcus8eumtr7.hd.mp4', 'ndza6yswd0k6vlboxyhk.hd.mp4'],
    "snowy-rainy": ['on3ysblo5hzdmrhv1kwh.hd.mp4', 'psi1hhbsshcus8eumtr7.hd.mp4', 'ndza6yswd0k6vlboxyhk.hd.mp4'],
    "sunny": ['hlhff0h8md4ev0kju5be.hd.mp4', 'zjqsoc6ecqhntpl5vacs.hd.mp4', 'jvw1avupguhfbo11betq.hd.mp4', '8cmeusxf3pkanai43djs.hd.mp4', 'guwb10mfddctfvwioaex.hd.mp4'],
    "windy": ['2qmg1xgcswq79lxu09rl.hd.mp4', 'guwb10mfddctfvwioaex.hd.mp4', '5y73ml3xqz6drbuzja1e.hd.mp4'],
    "windy-variant": ['2qmg1xgcswq79lxu09rl.hd.mp4', 'guwb10mfddctfvwioaex.hd.mp4', '5y73ml3xqz6drbuzja1e.hd.mp4'],
    "exceptional": ['Exception1.mp4', 'Exception2.mp4', 'Exception3.mp4'],

    // Built-in Page Defaults (Can be expanded by user via JSON)
    "page-wallbox": ['ch1.webm', 'ch2.webm'],
    "page-cam": ['1.webm']
};

// ==========================================
// RUNTIME VARIABLES & ELEMENT CREATION
// ==========================================
let lastPathname = window.location.pathname;
let currentIntervalId = null;
let currentSwitchPeriod = videoSwitchPeriod_;
let routeTimer, stopped=false, initialized=false, currentPool='', selectedURL='';
let configController, configTimeout, playPending=false, lastPlayAttempt=-Infinity;
const metrics={sourceChanges:0,configState:'loading'};


const video = document.createElement('video');
video.id = "myVideo";
video.loop = true;
video.muted = true;
video.playsInline = true;
video.preload = 'auto';

function getHass() {
    const ha = document.querySelector('home-assistant');
    if (ha && ha.hass) return ha.hass;
    const main = document.querySelector('home-assistant-main');
    if (main && main.hass) return main.hass;
    return null;
}

async function loadExternalConfig() {
    try {
        configController=new AbortController();
        configTimeout=setTimeout(()=>configController.abort(),2000);
        const response = await fetch(`${localVideoPath_}/config.json`,{signal:configController.signal,cache:'no-cache'});
        if(stopped)return;
        if (response.ok) {
            const json = await response.json();
            if (json && json.videoFiles) {
                for (const key in json.videoFiles) {
                    if (Array.isArray(json.videoFiles[key])) {
                        const files=json.videoFiles[key].filter(file=>typeof file==='string'&&file.trim());
                        if(files.length)videoFiles[key] = files;
                    }
                }
                metrics.configState='loaded';
                console.info('ANIMATED-BACKGROUNDS: External config.json loaded successfully.');
            }
        } else {
            metrics.configState='defaults';
        }
    } catch (e) {
        metrics.configState=e.name==='AbortError'?'timeout':'defaults';
        if(!stopped)console.warn('ANIMATED-BACKGROUNDS: Optional config unavailable; defaults remain active.', e);
    } finally {clearTimeout(configTimeout);if(!stopped&&metrics.configState==='loading')metrics.configState='defaults';}
}

// Never wait for weather before showing page-specific or fallback backgrounds.
function readWeather() {
    const states=getHass()?.states;
    if(!states)return 'unknown';
    const control=states[weatherControlHelper_]?.state,local=states[weatherUseLocalHelper_]?.state;
    if(control==='on'||control==='off')weatherControl_=control==='on';
    if(local==='on'||local==='off')weatherUseLocal_=local==='on';
    const period=Number(states[videoSwitchPeriodHelper_]?.state);
    if(Number.isFinite(period)&&period>0)videoSwitchPeriod_=Math.max(1,Math.min(period,2147483));
    const weather=states[weatherEntity_]?.state;
    return weather&&weather!=='unavailable'?weather:'unknown';
}

function getVideoConfig(weatherState) {
    let config = {
        path: localVideoPath_,
        files: videoFiles["random"],
        autoplay: true
    };

    // 1. DYNAMIC PAGE DETECTION (Sorted by key length)
    // Prevents for example "config" matching "developer-tools".
    const pageKeys = Object.keys(videoFiles)
    .filter(key => key.startsWith("page-"))
    .sort((a, b) => b.length - a.length);

    for (const key of pageKeys) {
        const urlKeyword = key.substring(5); // Strips "page-"
        if (window.location.pathname.includes(urlKeyword)) {
            config.files = videoFiles[key];

            if (urlKeyword === "cam") {
                config.autoplay = !lowPowerMode;
            }
            return config;
        }
    }

    // 2. Weather Logic
    if (weatherControl_ === true) {
        config.path = weatherUseLocal_ ? localVideoPath_ : flixelVideoPath_;

        if (videoFiles[weatherState]) {
            config.files = videoFiles[weatherState];
        } else {
            config.path = localVideoPath_;
            config.files = videoFiles["random"];
        }
    }

    return config;
}

function updateIntervalTimer() {
    clearInterval(currentIntervalId);
    currentSwitchPeriod=videoSwitchPeriod_;
    currentIntervalId=setInterval(()=>updateVideoSource(true),currentSwitchPeriod*1000);
}

function applyPlayback(autoplay) {
    const moving=!navigator.userAgent.includes(slowDeviceUserAgent)&&autoplay;
    video.autoplay=moving;
    if(!moving||document.hidden){video.pause();return;}
    if(video.paused&&!playPending&&performance.now()-lastPlayAttempt>2000){
    playPending=true;lastPlayAttempt=performance.now();
    video.play().catch(error=>{
        // Source changes can abort an earlier play(); this is not an autoplay failure.
        if(!stopped&&error.name!=='AbortError')console.debug('ANIMATED-BACKGROUNDS: Playback deferred.',error);
    }).finally(()=>{playPending=false});
    }
}

function updateVideoSource(rotate=false) {
    if(stopped||!initialized)return;
    const config=getVideoConfig(readWeather());
    if(currentSwitchPeriod!==videoSwitchPeriod_)updateIntervalTimer();
    if(!config.files?.length)return;
    const pool=JSON.stringify([config.path,config.files]);
    if(pool!==currentPool||!selectedURL||(rotate&&!document.hidden)){
        currentPool=pool;
        const file=config.files[Math.floor(Math.random()*config.files.length)];
        const url=new URL(config.path+'/'+file,location.href).href;
        if(url!==selectedURL){selectedURL=url;video.src=url;lastPlayAttempt=-Infinity;metrics.sourceChanges++;}
    }
    applyPlayback(config.autoplay);
}

function routeChanged(){lastPathname=location.pathname;updateVideoSource();}
function pollState(){
    // Catch navigation without HA's event and helpers/weather becoming available later.
    if(document.hidden)return;
    if(location.pathname!==lastPathname)routeChanged();else updateVideoSource();
}
function visibilityChanged(){if(document.hidden)video.pause();else {lastPlayAttempt=-Infinity;routeChanged();}}
function stop(){
    stopped=true;clearInterval(routeTimer);clearInterval(currentIntervalId);clearTimeout(configTimeout);configController?.abort();
    document.removeEventListener('DOMContentLoaded',init);
    document.removeEventListener('visibilitychange',visibilityChanged);
    for(const event of ['location-changed','popstate','pageshow'])window.removeEventListener(event,routeChanged);
    video.pause();video.removeAttribute('src');video.load();video.remove();
    document.getElementById('ha-animated-backgrounds-style')?.remove();
}
window.haAnimatedBackgrounds={version:'1.6.0',refresh:routeChanged,stop,
    get status(){return {stopped,initialized,pathname:lastPathname,source:selectedURL,...metrics}}};

function init() {
    if(stopped||initialized)return;
    initialized=true;
    // Install layout before any fetch/play work. A slow optional JSON must not
    // leave an unstyled video in the document or block route subscriptions.
    const style=document.createElement('style');style.id='ha-animated-backgrounds-style';
    style.textContent=`#myVideo { position: fixed; right: 0; bottom: 0; width: 100vw; height: 100vh; object-fit: cover; z-index: -1; pointer-events: none; }
    .content { position: fixed; bottom: 0; background: rgba(0, 0, 0, 0.5); color: #f1f1f1; width: 100%; padding: 20px; }
    #myBtn { width: 200px; font-size: 18px; padding: 10px; border: none; background: #000; color: #fff; cursor: pointer; }
    #myBtn:hover { background: #ddd; color: black; }`;
    document.head.append(style);document.body.prepend(video);
    for(const event of ['location-changed','popstate','pageshow'])window.addEventListener(event,routeChanged);
    document.addEventListener('visibilitychange',visibilityChanged);
    updateIntervalTimer();updateVideoSource();
    routeTimer=setInterval(pollState,500);
    loadExternalConfig().then(()=>{if(!stopped)updateVideoSource()});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
