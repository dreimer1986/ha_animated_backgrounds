# Animated Home Assistant Backgrounds (Universal Edition)

This script brings seamless, automated video backgrounds to your Home Assistant dashboards. It can play videos completely at random, change them dynamically based on the current weather state (using local files or the Flixel CDN), or force specific videos depending on the dashboard page you are currently viewing.

This script is completely universal. You no longer need to modify the JavaScript code to add new pages, custom videos, or change video formats. Everything is managed externally via a clean config.json file!

# 📑 Table of Contents

* [📜 Foreword & Evolution](#foreword)
* [🚀 Features](#features)
* [📦 Installation](#install)
* [⚙️ The Magic Configuration (config.json and Home Assistant Helpers)](#config)
* [🎨 Theme Modifications (Making it transparent)](#themes)
* [🐒 TamperMonkey Scripts (Making even more transparent)](#tampermonkey-scripts)
* [📜 Closing Words](#closing_words)
* [📸 Screenshots](#screenshots)

## <a name="foreword"></a>📜 Foreword & Evolution

After Home Assistant 2023.04 went final many people found out that "Animated Lovelace Background" by Villhellm is not working anymore. As I used this addin for a while now, I had a lil tantrum in the 2023.04 beta time... I opened a report right on realization of the problems in Villhellm's repo. I hoped for someone else to fix it as we all know Villhellm has passed away and I never before did much JS coding... Soon, the needed information was made public in #beta what to do for fixing all kind of custom addons. In the end, with some useless sidesteps in JS Script form, I myself fixed it and it worked again. I even have an own fork with the fix included. Some obsolete sections needed to be removed and the fix from #beta did the rest.

So... why did you make your own solution then you ask? I did quite some messed up things with the addin including the sidebar being transparent on my own theme ([Here is its repo](https://github.com/dreimer1986/yourname_uix) btw ^^). This is not working anymore at all with the current way the addin injects the video into the website.

You can imagine the website as a tree. Down at the roots is "body" and from there you have different sections with different sub-sections etc. etc. creating the website you see. In the past the sidebar was a sub branch of the dashboard, now both are on the same level. Look wise not much of a difference, but a modified dashboard now cannot modify the look of the sidebar anymore. That was a feature I wanted so badly in the past and I did not fight for so long to get it working just to give up now.

I talked with a few people and just found out that this injection is not deep down enough to modify both parts altogether. So I did some experiments. My theme already had a fixing script from addin times that switched some mainly sidebar stuff to transparent background to be able to see the layer below. (Like the video background in that case). That script was my aim.

Playing a video on a website as background is no witchcraft and so I slowly extended the script to play the video instead of the addin. I decided to go down to the very beginning aka "body" with my injection to bypass as many possible future breakages as possible. Now I needed clear view to that layer...

Here my own theme came in handy. I had to modify a few global values and things looked fine. I even removed a few UIX theme hacks and switched to a proper solution in the theme data itself. The result was... WONDERFUL! No flickering, no sometimes not playing video, no short periods showing up the original background image... ALL WAS JUST FINE!

Now I thought I should extend the script a bit. Like, make it more user friendly to modify for our own needs and add a few neat features maybe. The randomizer was the first step, it got extended to not expect videos to be numbered 1.mp4-x.mp4 but use a random video regardless of the naming. Then I thought about adding the weather depending background feature from Villhellm's addin, too.

And here we are now... A perfectly fine working alternative with not all, but most features the addin had, too. What started as a quick theme hack has now evolved into a highly optimized, fully-fledged background engine. You no longer have to maintain different script variations or touch a single line of JavaScript code just because you added a new dashboard tab. This one handles everything dynamically.

## <a name="features"></a>🚀 Features
🛠️ **Zero Code Modification:**<br/>
Install it once, control everything else through a separate JSON configuration file.

🔀 **Dynamic Page Routing:**<br/>
Simply add a list with the prefix page-your-tab in your JSON, and the script automatically switches to those videos whenever the URL path contains /your-tab.

🎞️ **Codec-Mix (MP4 & WebM):**<br/>
The script dynamically detects the MIME-type on every single video change. You can freely mix .mp4 and .webm files inside the very same list.

⚡ **Instant Cache-Busting:**<br/>
The configuration file is requested with browser cache revalidation. Any updates to your video lists are active immediately after a page refresh—no more manual browser cache purging!

🔒 **No Long-Term Tokens Needed:**<br/>
The script safely communicates directly with the native Home Assistant frontend DOM object to fetch states, removing the old requirement for manual long-term access tokens.

🎛️ **Home Assistant Helper Support:**<br/>
Toggle weather control, switch between local/CDN paths, or adjust the video rotation interval in real-time using native input_boolean or input_number entities directly from your UI.

## <a name="install"></a>📦 Installation

### HACS / Marketplace (recommended)

1. Add `https://github.com/dreimer1986/ha_animated_backgrounds` as a custom repository of type **Dashboard** in HACS (the built-in Marketplace uses the same package).
2. Download **Animated Backgrounds & Liquid Glass**. Both modules are included in one file. HACS normally registers it as a dashboard JavaScript module automatically; for YAML resources, add `/hacsfiles/ha_animated_backgrounds/ha_animated_backgrounds.js` yourself.
3. To activate backgrounds and glass on the sidebar and non-dashboard pages too, merge this into your existing `configuration.yaml`:

```yaml
frontend:
  extra_module_url:
    - /hacsfiles/ha_animated_backgrounds/ha_animated_backgrounds.js
```

4. Restart Home Assistant and refresh each browser/app frontend. Make your theme transparent as explained below. Liquid Glass is configured through theme variables; see [the glass guide](GLASS-README.md).
5. Optionally put personal videos and configuration in `www/animated_backgrounds/` as described below.

For migration, remove the old `/local/styles.js?...` and `/local/ha-liquid-glass.js?...` entries from **both** dashboard resources and `frontend.extra_module_url`. Do not load the old scripts alongside the new bundle: whichever loads first owns that module. Keep your existing videos and JSON unchanged.

### Updates

Install new versions through HACS/Marketplace, then refresh the frontend. HACS updates its dashboard resource URL for cache invalidation. If a browser still shows the old globally loaded version, hard-refresh it or append the new release version (for example `?v=1.7.0`) to the `extra_module_url` entry and restart Home Assistant. Never edit the generated file under `www/community/ha_animated_backgrounds/`: updates replace that directory.

Personal files remain under `www/animated_backgrounds/` and are not part of the HACS package. Tampermonkey scripts still need separate installation in the browser extension. `Glass-Test/` contains development previews/tests and is not required on your HA server.

### Manual installation

Copy `dist/ha_animated_backgrounds.js` to `config/www/ha_animated_backgrounds.js`. Add `/local/ha_animated_backgrounds.js?v=1.7.0` as a JavaScript-module dashboard resource and to `frontend.extra_module_url`. Restart Home Assistant. Replace this file and update its version query when upgrading. The separate `www/styles.js` and `www/ha-liquid-glass.js` remain available for existing manual installations; use either those or the bundle.

## <a name="config"></a>⚙️ The Magic Configuration (config.json and Home Assistant Helpers)

Create `config/www/animated_backgrounds/config.json` (served as `/local/animated_backgrounds/config.json`). You can copy [config.json.example](www/config.json.example) as a starting point. This location is fixed even if you choose a different video directory.

Minimal example for local random videos:

```json
{
  "settings": {
    "weatherControl": false,
    "weatherEntity": "weather.forecast_home",
    "videoSwitchPeriod": 180
  },
  "videoFiles": {
    "random": ["garden.mp4", "evening.webm"],
    "page-wallbox": ["charging.webm"]
  }
}
```

Put those video files next to the JSON. For weather-based local playback, set both `weatherControl` and `weatherUseLocal` to `true` and provide lists such as `sunny`, `rainy` and `clear-night`. With `weatherUseLocal: false`, weather filenames refer to the Flixel CDN instead. Random and page-specific lists always use the local video path.

All fields are optional. Existing files containing only `videoFiles` remain compatible. Non-empty filename lists replace the corresponding built-in lists; omitted or empty lists retain defaults. Supply filenames relative to the video directory, including `.mp4` or `.webm`. Some built-in random/page lists and the `hail`/`exceptional` weather lists are placeholders: provide your own files for these conditions.

Use valid JSON: double quotes, no comments or trailing commas. Invalid or unavailable configuration falls back to defaults, with a message in the browser console. Configuration loading has a two-second timeout so it cannot block the interface. Refresh the page after saving; the request revalidates the JSON rather than reusing it silently from cache. Playback may briefly use defaults while configuration loads.

**How does Dynamic Page Routing work?**<br/>
If a user opens a dashboard tab with the URL /dashboard-main/wallbox, the script scans the JSON keys starting with page-. It detects page-wallbox, matches the keyword wallbox against the current URL path, and immediately switches the background to your specified wallbox loops. The moment you navigate away to a standard page, it instantly reverts back to the default weather or random rotation!

**Optional Home Assistant Helpers**

The script automatically checks for predefined helpers in Home Assistant. If these entities do not exist on your system, the script seamlessly falls back to its internal default values. No modifications to the JavaScript code are required.

| Function | Entity Type | Default Entity ID | Description |
| :--- | :--- | :--- | :--- |
| **Weather Control** | `input_boolean` | `input_boolean.animated_backgrounds_weather_control` | **On:** Backgrounds change dynamically based on the current weather state.<br>**Off:** Only random videos from the `random` list will be played. |
| **Use Local Files** | `input_boolean` | `input_boolean.animated_backgrounds_use_local` | **On:** Uses local files under `/local/animated_backgrounds/` for weather states as well.<br>**Off:** Loads weather videos efficiently from the Flixel CDN. |
| **Switch Interval** | `input_number` | `input_number.animated_backgrounds_video_switch_period` | Defines the interval in seconds after which a new random video is selected from the active list (e.g., `180` for 3 minutes). |

### Settings reference

Place these keys inside the `settings` object. You do not need to edit JavaScript.

| Key | Default | Meaning |
| --- | --- | --- |
| `weatherEntity` | `weather.forecast_home` | Weather entity to read. |
| `localVideoPath` | `/local/animated_backgrounds` | Base URL for local videos; does not move the JSON file. |
| `flixelVideoPath` | `https://cdn.flixel.com/flixel` | Base URL for remote weather videos. |
| `weatherControl` | `true` | Weather selection; `false` selects the random list unless a page rule matches. |
| `weatherUseLocal` | `false` | Resolve weather filenames under the local path instead of the CDN. |
| `videoSwitchPeriod` | `180` | Rotation interval in seconds; positive number, limited to 1–2147483. |
| `weatherControlHelper` | `input_boolean.animated_backgrounds_weather_control` | Optional helper overriding `weatherControl`. |
| `weatherUseLocalHelper` | `input_boolean.animated_backgrounds_use_local` | Optional helper overriding `weatherUseLocal`. |
| `videoSwitchPeriodHelper` | `input_number.animated_backgrounds_video_switch_period` | Optional helper overriding the interval. |
| `slowDeviceUserAgent` | `Kindle` | Case-sensitive user-agent substring for paused-video mode. |
| `lowPowerMode` | `false` | Pause playback for the built-in `page-cam` rule. |

Precedence: built-in defaults → JSON settings → available Home Assistant helpers. A valid helper state therefore takes precedence over the corresponding JSON value. Missing/unavailable helpers leave the current setting in place. Booleans must be JSON `true`/`false`, the interval must be a number, and entity IDs/paths must be non-empty strings. Invalid individual settings are ignored.

The JSON and videos are public static files under `/local/`; do not put passwords or tokens there. No authentication tokens are needed by this module.

## <a name="themes"></a>🎨 Theme Modifications (Making it transparent)

Because the video element is injected at the very bottom layer of the webpage, your dashboards and cards must be made transparent so the video can shine through. Open your favorite theme's .yaml file and adjust the following variables:

### lovelace-background:

The background image of the theme it is. Of course this is in the way if you wanna play a video there. So you set it to "transparent". 

```yaml
lovelace-background: "transparent"
```

### app-header-background-color:

The top navigation header bar looks best with a semi-transparent styling. Convert your theme's HEX color to RGB (https://www.rapidtables.com/convert/color/hex-to-rgb.html) and add an alpha value using rgba(..., 0.5) for a sleek 50% look-through effect:

```yaml
app-header-background-color: "rgba(20, 26, 50, 0.5)"
```

### sidebar-background-color:

To make the left sidebar transparent and let the background video span perfectly across the entire screen, link its background to the header color:

```yaml
sidebar-background-color: "var(--app-header-background-color)"
```

### app-header-edit-background-color:

Ensures that the header area keeps its clean transparency look even while you are actively editing your Lovelace dashboards:

```yaml
app-header-edit-background-color: "var(--app-header-background-color)"
```

**The UIX - UI eXtension fun**
If you use UIX (https://uix-guides.lf.technology/) you can make other crazy things, too. Just check my theme you find here: https://github.com/dreimer1986/yourname_uix
Most of the UIX code is commented what it was made for. Have fun doing crazy things that were never meant to be realized with the limited themes-engine Home Assistant provides... :D

### ⚠️ WARNING:
Theme changes will not take effect immediately. Go to the Developer Tools -> Services tab in Home Assistant and run the service frontend.reload_themes to force-refresh the styling!

## <a name="tampermonkey-scripts"></a>🐒 TamperMonkey Scripts (Making even more transparent)

# TamperMonkey Scripts for Music Assistant and HACS

If you want to have some nice Backgrounds inside Music Assistant and HACS, too... You have to use TamperMonkey.
Why? Because iFrames suck!!! There is absolutely NO WAY AT ALL, NEVER, EVER, NULL AND NADA to change anything inside these with the default tricks you have with UIX and themes.

Even worse.. HACS is even more evil and if you tinker with the background stuff inside TamperMonkey you will get a sweet white-yellow'ish background and no Video running at all! To "fix" this we have to use opacity and make the whole thing semi-transparent. There is NO OTHER WAY!

Luckily Music Assistant is another caliber and happily applies the background if we remove some layers with TamperMonkey's help.

Here some nice pics:

**HACS**
<p align="center">
  <img src="https://raw.githubusercontent.com/dreimer1986/ha_animated_backgrounds/refs/heads/master/TamperMonkey-Scripts/assets/hacs.webp" alt="HACS" width="100%">
</p>

**Music Assistant**
<p align="center">
  <img src="https://raw.githubusercontent.com/dreimer1986/ha_animated_backgrounds/refs/heads/master/TamperMonkey-Scripts/assets/music-assistant.webp" alt="Music Assistant" width="100%">
</p>

## <a name="closing_words"></a>📜 Closing Words

All my stuff here is licensed under MIT license. You can use it for whatever you see it fit. But if you use stuff from me, then at least mention my name. That's all I ask for. ^^

Have fun tweaking your smart home and feeding your dashboards with beautiful backgrounds! 😎

## <a name="screenshots"></a>📸 Screenshots

These are the very same pics shown on my own Modified Theme Repo: https://github.com/dreimer1986/yourname_uix

**Kataware-doki**
<p align="center">
  <img src="https://raw.githubusercontent.com/dreimer1986/yourname_uix/refs/heads/master/assets/kataware-doki-home-overview.webp" alt="Kataware-doki - Home overview">
</p>

**Tiamat**
<p align="center">
  <img src="https://raw.githubusercontent.com/dreimer1986/yourname_uix/refs/heads/master/assets/tiamat-home-overview.webp" alt="Tiamat - Home overview">
</p>

**Original**
<p align="center">
  <img src="https://raw.githubusercontent.com/dreimer1986/yourname_uix/refs/heads/master/assets/original-home-overview.webp" alt="Original - Home overview">
</p>

**Kataware-doki - Settings - About**
<p align="center">
  <img src="https://raw.githubusercontent.com/dreimer1986/yourname_uix/refs/heads/master/assets/kataware-doki-settings-about.webp" alt="Kataware-doki - Settings - About">
</p>

**Tiamat - Settings - About**
<p align="center">
  <img src="https://raw.githubusercontent.com/dreimer1986/yourname_uix/refs/heads/master/assets/tiamat-settings-about.webp" alt="Tiamat - Settings - About">
</p>

**Original - Settings - About**
<p align="center">
  <img src="https://raw.githubusercontent.com/dreimer1986/yourname_uix/refs/heads/master/assets/original-settings-about.webp" alt="Original - Settings - About">
</p>

**Kataware-doki - Mobile**
<p align="center">
  <img src="https://raw.githubusercontent.com/dreimer1986/yourname_uix/refs/heads/master/assets/kataware-doki-mobile.webp" alt="Kataware-doki - Mobile version" width="50%">
</p>

**Tiamat - Mobile**
<p align="center">
  <img src="https://raw.githubusercontent.com/dreimer1986/yourname_uix/refs/heads/master/assets/tiamat-mobile.webp" alt="Tiamat - Mobile version" width="50%">
</p>

**Original - Mobile**
<p align="center">
  <img src="https://raw.githubusercontent.com/dreimer1986/yourname_uix/refs/heads/master/assets/original-mobile.webp" alt="Original - Mobile version" width="50%">
</p>

## Liquid Glass and UIX sidebar

The glass module is included in the combined HACS bundle. Its canonical source remains [`www/ha-liquid-glass.js`](www/ha-liquid-glass.js). Version 0.5 added individual glass sidebar buttons, coordinated with the updated Your Name UIX themes. Use the combined installation instructions above; do not additionally load the standalone scripts. See [theme settings](Glass-Test/INSTALL.md) and the [offline configurator](Glass-Test/Glass-Vergleich.html).

The user confirmed the version 0.4 glass effect works in Chrome on Android and the official Home Assistant app. The new sidebar integration has been checked locally and still needs validation on the actual device.

### Startup and navigation

The HACS bundle includes the scheduling improvements introduced in background engine 1.6.0 and glass 0.6.0. Keep existing theme values. Optional JSON loads asynchronously with a two-second timeout; built-in backgrounds work while it loads. HA helper/weather changes are picked up within 500 ms, with no weather retry delay on page transitions. The video continues when the selected pool is unchanged. Diagnostics: `window.haAnimatedBackgrounds.status`; stop with `.stop()`. Glass observes new open shadow roots directly and caches identical displacement textures. See `Glass-Test/INSTALL.md` for measurements and remaining browser/rendering limits.

## Building and releasing

The canonical sources remain `www/styles.js` and `www/ha-liquid-glass.js`.

```sh
python scripts/build_hacs.py
python scripts/build_hacs.py --check
node --test tests/config.test.cjs
```

Commit the generated `dist/ha_animated_backgrounds.js` with source changes. The bundle contains both modules, so a release cannot mix cached imports from different versions. Personal config, videos and development files are excluded. Push a version tag such as `v1.7.0` after updating the changelog to trigger validation and a GitHub release with the standalone bundle attached. Branch/PR checks also verify that the bundle matches its sources.
