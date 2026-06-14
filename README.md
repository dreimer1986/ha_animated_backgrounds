# Animated Home Assistant Backgrounds (Universal Edition)

This script brings seamless, automated video backgrounds to your Home Assistant dashboards. It can play videos completely at random, change them dynamically based on the current weather state (using local files or the Flixel CDN), or force specific videos depending on the dashboard page you are currently viewing.

This script is completely universal. You no longer need to modify the JavaScript code to add new pages, custom videos, or change video formats. Everything is managed externally via a clean config.json file!

# 📑 Table of Contents

* [📜 Foreword & Evolution](#foreword)
* [🚀 Features](#features)
* [📦 Installation](#install)
* [⚙️ The Magic Configuration (config.json and Home Assistant Helpers))](#config)
* [🎨 Theme Modifications (Making it transparent)](#themes)
* [📜 Closing Words](#closing_words)

## <a name="foreword"></a>📜 Foreword & Evolution

After Home Assistant 2023.04 went final many ppl found out that "Animated Lovelace Background" by Villhellm is not working anymore. As I used this addin for a while now, I had a lil tantrum in the 2023.04 beta time... I opened a report right on realization of the problems in Villhellm's repo. I hoped for someone else to fix it as we all know Villhellm has passed away and I never before did much JS coding... Soon there were the needed information made public in #beta what to do for fixing all kind of custom addons. In the end, with some useless sidesteps in JS Script form, I myself fixed it and it worked again. I even have a own fork with the fix included. Some obsolete section needed to be removed and the fix from #beta did the rest.

So... why did you make your own solution then you ask? I did quite some messed up things with the addin including the sidebar being transparent on my own theme (You are in it's repo btw ^^). This is not working anymore at all with the current way the addin injects the video into the website.

You can imagine the website as a tree. Down at the roots is "body" and from there you have different sections with different sub-sections etc. etc. creating the website you see. In the past the sidebar was a sub branch of the dashboard, now both are on the same level. Look wise not much of a difference, but a modified dashboard now cannot modify the look of the sidebar anymore. That was a feature I wanted so badly in the past and I did not fight for so long to get it working just to give up now.

I talked with a few people and just found out that this injection is not deep down enough to modify both parts altogether. So I did some experiments. My theme already had a fixing script from addin times that switched some mainly sidebar stuff to transparent background to be able to see the layer below. (Like the video background in that case). That script was my aim.

Playing a video on a website as background is no witchcraft and so I slowly extended the script to play the video instead of the addin. I decided to go down to the very beginning aka "body" with my injection to bypass as many possible future breakages as possible. Now I needed clear view to that layer...

Here my own theme came in handy. I had to modify a few global values and things looked fine. I even removed a few UIX theme hacks and switched to a proper solution in the theme data itself. The result was... WONDERFUL! No flickering, no sometimes not playing video, no short periods showing up the original background image... ALL WAS JUST FINE!

Now I thought I should extend the script a bit. Like, make it more user friendly to modify for our yown needs and add a few neat features maybe. The randomizer was the first step, it got extended to not expect videos to be numbered 1.mp4-x.mp4 but use a random video regardless of the naming. Then I thought about adding the weather depeding background feature from Villhellm's addin, too.

And here we are now... A perfectly fine working alternative with not all, but most features the addin had, too. What started as a quick theme hack has now evolved into a highly optimized, fully-fledged background engine. You no longer have to maintain different script variations or touch a single line of JavaScript code just because you added a new dashboard tab. This one handles everything dynamically.

## <a name="features"></a>🚀 Features
**Zero Code Modification:** Install it once, control everything else through a separate JSON configuration file.

**Dynamic Page Routing:** Simply add a list with the prefix page-your-tab in your JSON, and the script automatically switches to those videos whenever the URL path contains /your-tab.

**Codec-Mix (MP4 & WebM):** The script dynamically detects the MIME-type on every single video change. You can freely mix .mp4 and .webm files inside the very same list.

**Instant Cache-Busting:** The configuration file is fetched with a cache-busting timestamp. Any updates to your video lists are active immediately after a page refresh—no more manual browser cache purging!

**No Long-Term Tokens Needed:** The script safely communicates directly with the native Home Assistant frontend DOM object to fetch states, removing the old requirement for manual long-term access tokens.

**Home Assistant Helper Support:** Toggle weather control, switch between local/CDN paths, or adjust the video rotation interval in real-time using native input_boolean or input_number entities directly from your UI.

## <a name="install"></a>📦 Installation

1. Copy the styles.js file into your Home Assistant local www folder: config/www/ (or /homeassistant/www/).
2. In Home Assistant, go to Settings -> Dashboards -> Resources (click the three dots in the top right corner if you don't see it).
3. Add a new resource:
   URL: /local/styles.js?v=1.5
   Resource type: JavaScript-Modul
4. Open your configuration.yaml and append the script to your frontend section:
5. Add /local/styles.js?v=1 to the frontend section:
   <pre>
   YAML
   frontend:
     extra_module_url:
       - /local/styles.js?v=1.5
   </pre>
6. **Optional:** Create a folder named config/www/animated_backgrounds/ to store your local video files.
7. Restart Home Assistant or reload the core configuration.

## <a name="config"></a>⚙️ The Magic Configuration (config.json and Home Assistant Helpers)

To supply your own videos or set up specific pages, create a file named config.json and place it right inside your video directory (www/animated_backgrounds/config.json).

Example: A fully customized config.json
JSON
{
  "videoFiles": {
    "sunny": [
      "my_local_sunny_day.mp4",
      "another_clear_sky.webm"
    ],
    "rainy": [
      "cozy_rain_loop.mp4"
    ],
    "page-wallbox": [
      "charging_animation_1.webm",
      "tesla_loop.mp4"
    ],
    "page-livingroom": [
      "fireplace_4k.mp4"
    ]
  }
}

**How does Dynamic Page Routing work?**
If a user opens a dashboard tab with the URL /dashboard-main/wallbox, the script scans the JSON keys starting with page-. It detects page-wallbox, matches the keyword wallbox against the current URL, and immediately switches the background to your specified wallbox loops. The moment you navigate away to a standard page, it instantly reverts back to the default weather or random rotation!

**Optional Home Assistant Helpers**

The script automatically checks for predefined helpers in Home Assistant. If these entities do not exist on your system, the script seamlessly falls back to its internal default values. No modifications to the JavaScript code are required.

| Function | Entity Type | Default Entity ID | Description |
| :--- | :--- | :--- | :--- |
| **Weather Control** | `input_boolean` | `input_boolean.animated_backgrounds_weather_control` | **On:** Backgrounds change dynamically based on the current weather state.<br>**Off:** Only random videos from the `random` list will be played. |
| **Use Local Files** | `input_boolean` | `input_boolean.animated_backgrounds_use_local` | **On:** Uses local files under `/local/animated_backgrounds/` for weather states as well.<br>**Off:** Loads weather videos efficiently from the Flixel CDN. |
| **Switch Interval** | `input_number` | `input_number.animated_backgrounds_video_switch_period` | Defines the interval in seconds after which a new random video is selected from the active list (e.g., `180` for 3 minutes). |

**The manual way**
If you look at the script with a fitting editor you can see the starting section has a few settings you can tinker with and by doing so, change the default settings without the need to a config.
All of them are being explained now:

### const weatherEntity_ = "weather.forecast_home";

Needed if you want to use the weather depending backgrounds. I chose the Home Assistant default one here. "weather.forecast_home" The state of this entity controls the backgrounds that are being used.

### const localVideoPath_ = "/local/animated_backgrounds"

Path to your locally saved videos. I have my whole bunch on my Home Assistant hardware, but you can decide if you use local files or videos coming from flixel.com. By default this path does not do anything unless you change "weatherControl_" aka "input_boolean.animated_backgrounds_weather_control" or "weatherUseLocal_" aka "input_boolean.animated_backgrounds_use_local". Otherwise the videos will be taken from flixel.com. For convenience I put the correct paths for the flixel.com hosted videos used by Villhellm's addin here aswell. The flixel.com videos are already in the lists we talk about below.

### const flixelVideoPath_ = "https://cdn.flixel.com/flixel";

Keep as it is, unless flixel changes stuff on their website! This one is needed to create a working flixel.com video-link!

### let weatherControl_ = true;

If a pure randomizer is needed, set it to false. For weather based randomizer, leave it set to true.

### let weatherUseLocal_ = false;

Allows you to choose if the weather videos should come from flixel.com or local folders, keep default if you just want animated backgrounds and have no videos prepared at all.

### let videoSwitchPeriod_ = 180;

After x seconds, the video will be diced again. This verifies the weather is still the same, too. Otherwise the dice will check the now correct file list.

### const weatherControlHelper_ = "input_boolean.animated_backgrounds_weather_control";

Here you can put a name for a Helper inside Home Assistant, like the default "input_boolean.animated_backgrounds_weather_control". The value you give it in Home Assistant will then be applied to "weatherControl_" above.

### const weatherUseLocalHelper_ = "input_boolean.animated_backgrounds_use_local";

Here you can put a name for a Helper inside Home Assistant, like the default "input_boolean.animated_backgrounds_use_local". The value you give it in Home Assistant will then be applied to "weatherUseLocal_" above.

### const videoSwitchPeriodHelper_ = "input_number.animated_backgrounds_video_switch_period";

Here you can put a name for a Helper inside Home Assistant, like the default "input_number.animated_backgrounds_video_switch_period". The value you give it in Home Assistant will then be applied to "videoSwitchPeriod_" above.

### const slowDeviceUserAgent = "Kindle";

Allows to add a device type as a exception to never playback videos and always show them paused. The value is compared to the user agent of the devices loading the Home Assistant websites. The default case are Amazon Kindles.

### const lowPowerMode = false;

Always forces videos to never playback and always show in paused state. Default is not using it.

### let videoFiles:

Below that you can find a longer list of video names.

First one is the one used by pure randomizer. In my case 62 videos numbered from 1.mp4 - 62.mp4. Edit to your needs.
ONLY used if weatherControl_: false;

Then there are 15 lists for specific weather types. You can differentiate them just by their names. Add the videos you want there, or leave it as it is to use flixel.com hosted ones. In this case it's Villhellm's list extended a bit to just need hail and exceptional condition videos before being complete. Rest is filled already. If you find nice videos on flixel, report them to me please!
ONLY used if weatherControl_: true; AND you set "let weatherUseLocal_ = false;" above. Otherwise it will try to load the video names locally.

### Sidenote

If you change anything on your settings inside the script after installation, go to the the Dashboard Ressources Settings again and edit the number on "/local/styles.js?v=" to something different than before. This will force a Cache reset on it and really activate your updates.

**OR YOU JUST USE THE CONFIG.JSON!**

### WARNING!

The syntax is there for a reason. So if you see "" or '' and the stuff you wanna edit is between them, then edit to your needs and be 100% sure that they are STILL THERE. :D Same for [] or the , separating stuff. All needs to be the same way as it is right now. But of course you can increase/reduce the filelist entry number to your liking. Right now they all have different numbers of entries and you can add one with a , and '' or remove one by removing it and one ,.

## <a name="themes"></a>🎨 Theme Modifications (Making it transparent)

Because the video element is injected at the very bottom layer of the webpage, your dashboards and cards must be made transparent so the video can shine through. Open your favorite theme's .yaml file and adjust the following variables:

### lovelace-background:

The background image of the theme it is. Of course this is in the way if you wanna play a video there. So you set it to "transparent". 

YAML
lovelace-background: "transparent"

### app-header-background-color:

The top navigation header bar looks best with a semi-transparent styling. Convert your theme's HEX color to RGB (https://www.rapidtables.com/convert/color/hex-to-rgb.html) and add an alpha value using rgba(..., 0.5) for a sleek 50% look-through effect:

YAML
app-header-background-color: "rgba(20, 26, 50, 0.5)"

### sidebar-background-color:

To make the left sidebar transparent and let the background video span perfectly across the entire screen, link its background to the header color:

YAML
sidebar-background-color: "var(--app-header-background-color)"

### app-header-edit-background-color:

Ensures that the header area keeps its clean transparency look even while you are actively editing your Lovelace dashboards:

YAML
app-header-edit-background-color: "var(--app-header-background-color)"

**The UIX - UI eXtension fun**
If you use UIX (https://uix-guides.lf.technology/) you can make other crazy things, too. Just check my theme you find here: https://github.com/dreimer1986/yourname_uix
Most of the UIX code is commented what it was made for. Have fun doing crazy things that were never meant to be realized with the limited themes-engine Home Assistant provides... :D

### ⚠️ WARNING:
Theme changes will not take effect immediately. Go to the Developer Tools -> Services tab in Home Assistant and run the service frontend.reload_themes to force-refresh the styling!

## <a name="closing_words"></a>📜 Closing Words

All my stuff here is licensed under MIT license. You can use it for whatever you see it fit. But if you use stuff from me, then at least mention my name. That's all I ask for. ^^

Have fun tweaking your smart home and feeding your dashboards with beautiful backgrounds! 😎
