console.info(
    '%c  ANIMATED-BACKGROUNDS  %c  version 1.5.1 (Universal)  %c  by dreimer1986 ',
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

const delay = ms => new Promise(res => setTimeout(res, ms));

const video = document.createElement('video');
video.id = "myVideo";
video.loop = true;
video.muted = true;
video.playsInline = true;

function getHass() {
    const ha = document.querySelector('home-assistant');
    if (ha && ha.hass) return ha.hass;
    const main = document.querySelector('home-assistant-main');
    if (main && main.hass) return main.hass;
    return null;
}

async function loadExternalConfig() {
    try {
        const response = await fetch(`${localVideoPath_}/config.json?t=${Date.now()}`);
        if (response.ok) {
            const json = await response.json();
            if (json && json.videoFiles) {
                for (const key in json.videoFiles) {
                    if (Array.isArray(json.videoFiles[key])) {
                        videoFiles[key] = json.videoFiles[key];
                    }
                }
                console.info('ANIMATED-BACKGROUNDS: External config.json loaded successfully.');
            }
        } else {
            console.info('ANIMATED-BACKGROUNDS: No optional config.json found. Using built-in defaults.');
        }
    } catch (e) {
        console.warn('ANIMATED-BACKGROUNDS: Error parsing config.json. Using defaults.', e);
    }
}

async function fetchWeatherRobustly() {
    for (let i = 0; i < 5; i++) {
        const hass = getHass();
        if (hass && hass.states) {
            if (weatherControlHelper_ !== "" && hass.states[weatherControlHelper_]) {
                weatherControl_ = (hass.states[weatherControlHelper_].state === "on");
            }
            if (weatherUseLocalHelper_ !== "" && hass.states[weatherUseLocalHelper_]) {
                weatherUseLocal_ = (hass.states[weatherUseLocalHelper_].state === "on");
            }
            if (videoSwitchPeriodHelper_ !== "" && hass.states[videoSwitchPeriodHelper_]) {
                const val = parseInt(hass.states[videoSwitchPeriodHelper_].state);
                if (!isNaN(val) && val > 0) {
                    videoSwitchPeriod_ = val;
                }
            }

            if (hass.states[weatherEntity_]) {
                const state = hass.states[weatherEntity_].state;
                if (state !== "unknown" && state !== "unavailable") {
                    return state;
                }
            }
        }
        await delay(500);
    }
    return "unknown";
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

function checkPageChange() {
    if (window.location.pathname !== lastPathname) {
        lastPathname = window.location.pathname;
        return true;
    }
    return false;
}

function updateIntervalTimer() {
    if (currentIntervalId) clearInterval(currentIntervalId);
    currentSwitchPeriod = videoSwitchPeriod_;

    currentIntervalId = setInterval(() => {
        updateVideoSource();
    }, currentSwitchPeriod * 1000);
}

async function updateVideoSource() {
    const weatherState = await fetchWeatherRobustly();
    const config = getVideoConfig(weatherState);

    if (!config.files || config.files.length === 0) return;

    const i = Math.floor(Math.random() * config.files.length);
    const selectedFile = config.files[i];
    const newSrc = config.path + "/" + selectedFile;

    const extension = selectedFile.split('.').pop().toLowerCase();
    const detectedType = (extension === 'webm') ? 'video/webm' : 'video/mp4';

    if (video.type !== detectedType) video.type = detectedType;
    if (!video.src.endsWith(newSrc)) video.src = newSrc;

    if ((navigator.userAgent).includes(slowDeviceUserAgent) || !config.autoplay) {
        video.autoplay = false;
        video.pause();
    } else {
        video.autoplay = true;
        video.play().catch(e => console.warn("Autoplay blocked:", e));
    }

    if (currentSwitchPeriod !== videoSwitchPeriod_) {
        updateIntervalTimer();
    }
}

async function init() {
    document.body.insertBefore(video, document.body.firstChild);
    await loadExternalConfig();
    updateVideoSource();
    updateIntervalTimer();

    window.setInterval(function() {
        if (checkPageChange()) {
            console.log("Global Route Event triggered:", window.location.pathname);
            updateVideoSource();
        }
    }, 1000);

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
    #myVideo { position: fixed; right: 0; bottom: 0; width: 100vw; height: 100vh; object-fit: cover; z-index: -1; pointer-events: none; }
    .content { position: fixed; bottom: 0; background: rgba(0, 0, 0, 0.5); color: #f1f1f1; width: 100%; padding: 20px; }
    #myBtn { width: 200px; font-size: 18px; padding: 10px; border: none; background: #000; color: #fff; cursor: pointer; }
    #myBtn:hover { background: #ddd; color: black; }
    `);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init());
} else {
    init();
}
