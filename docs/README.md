# Getting Started

[Demo](./demo/ ':ignore')

[Complete API Reference](./API.md)

If you just need some audio and don't need anything too complex, start at [Installation](#installation) and then read some of the [examples](#detailed-examples) to see if what you want to do is covered. If you want anything more complex than that, or if you have grand, complex ideas, you'll need to read the whole thing.

## Introduction

This is an audio library designed for the [Twine 2](https://twinery.org/) story format [Harlowe (v2.1.0 or later)](https://twine2.neocities.org/). It is the successor [to howler-for-harlowe](https://github.com/ChapelR/howler-for-harlowe) which will likely not be seeing any further updates.

**Why Not Keep Working on Howler-for-Harlowe?**

I wanted to, but there were a few things about HowlerJS that made it clash with Harlowe--this typically reared its head as the unfixable history system bug, where Howler just did not give a crap about Harlowe's history system, and they tripped over each other. On top of that, there were a number of features in Howler that I just don't imagine most Twine authors need, and we can put those KB to better use. Overall, this library 9KB, less functional, but more streamlined.

Howler-for-Harlowe will continue to exist, but I don't intend to fix it other than major bugs or security issues.

**What Else Should I Know?**

This library uses the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API) and [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises). That means Internet Explorer is out (I'm not sure if Harlowe actually supports IE). Other than that, all major modern browsers should work fine, though the volume control may look odd in certain browsers.

This library is free and dedicated to the public domain. That means you don't need to provide credit or attribution if you don't want to, and you can do anything you like with the code. [Review the license](https://github.com/ChapelR/harlowe-audio/blob/master/LICENSE) for any questions or concerns about that.

**I'm Having Trouble**

The best place to ask for help if the issue is on your end is [the Twine Q&A](https://twinery.org/questions/), [the Subreddit](https://www.reddit.com/r/twinegames/), or [the Discord server](https://discordapp.com/invite/n5dJvPp). If you suspect that the problem is in the code or otherwise on my end, [open an issue](https://github.com/ChapelR/harlowe-audio/issues/new).

**Donate**

Note: I suggest donating to [Twine development](https://www.patreon.com/klembot) if you really want to help out, but I'd welcome a few dollars if you feel like it.

[![ko-fi](https://www.ko-fi.com/img/donate_sm.png)](https://ko-fi.com/F1F8IC35)

## Installation

All you need to install this library is the code. There are two ways to get it: [copy and pasting from GitHub](https://github.com/ChapelR/harlowe-audio/tree/master/dist), or [via a Google Drive download](https://drive.google.com/file/d/1ThjHsBDzAwYNLc0p8g_V1fC-dLhBc8EH/view?usp=sharing). If you download the code, be sure to open it and mess with it in a text editor, *not* a word processor. Once you've got the code, you'll need to put in in your project.

**In Twine 2 (online or standalone)**, copy and paste the code in `harlowe-audio.min.js` into your [Story JavaScript area](https://twinery.org/wiki/twine2:adding_custom_javascript_and_css), and the code in `harlowe-audio.min.css` into your Story Stylesheet area.

**In Tweego or Entwine/Grunt-Entwine**, include the files in your command-line options or in your source code directory as appropriate. Remember to watch your file order, and refer to your compiler's docs if you need help.

**In Twee2**, create a special passage with the `script` tag and place the JavaScript code in that passage, and do the same thing with the CSS and a `style` tag. Refer to its [docs](https://dan-q.github.io/twee2/documentation.html#twee2-syntax-special-passages) for more.

# Overview

The following sections will describe what exactly you can do with this library and how.

## Configuration

If you take a look at the code of `harlowe-audio.min.js`, you'll see the `options` object near the top of the script, which you can use to configure the library to meet your needs. It looks like this:

```javascript
var options = {
    preload : true,
    loadDelay : 0,
    muteOnBlur : true,
    startingVol : 0.5,
    storagekey : '%%tw-audio',
    persistPrefs : true,
    globalA : true,
    includeFixes : false,
    controls : {
        show : true,
        startClosed : true,
        volumeDisplay : true
    },
    loadLimit : {
        track : 500,
        total : 8000
    }
};
```

---

- **the `preload` option**

Set this option to `true` or `false`.

Controls whether audio should be preloaded when the game is started, or if audio should only be loaded as needed. In most cases, you'll want to preload it. You can optionally include a loading screen by placing the `A.preload()` method beneath your track definitions.

---

- **the `loadDelay` option**

Set this option to a number representing an amount of milliseconds. 

Causes the loading screen to hang for a configurable number of milliseconds after loading completes. Use this to fine tune for edge cases, or work around [FOUC issues](https://en.wikipedia.org/wiki/Flash_of_unstyled_content).

---

- **the `muteOnBlur` option**

Set this option to `true` or `false`.

Setting this option to `true` causes the sound in your game to mute when the user is in another tab or window.

---

- **the `startingVol` option**

Set this option to a number between `0` and `1`.

Sets the default starting master volume.

---

- **the `storageKey` option**

Set this option to any string.

This library saves some data to local storage. You can use this option to change the key it uses.

---

- **the `persistPrefs` option**

Set this option to `true` or `false`.

The master volume and mute are considered user preferences, in that they are intended for users to adjust. You can use this option to cause changes to these settings to be saved and restored from local storage (using the above key). For example, if the user sets the master volume to `0.3`, then closes the game, the master volume will be `0.3` rather than the `startingVol` next time they play the game.

---

- **the `globalA` option**

Set this option to `true` or `false`.

By default, and throughout this guide, the API is sent to the global scope as `A`, matching howler-for-harlowe's way of doing things. If you don't want to have that, or if the `window.A` name is already taken, you can find everything at `Chapel.Audio` instead.

---

- **the `includeFixes` option**

Set this option to `true` or `false`.

Experimental feature. I'm going to try to clean up a few issues in Harlowe that I find, mostly boring things you'll never notice. Doesn't really belong in an audio library, so if I build a significant amount I will spin this into it's own thing. For now the code doesn't really add too much weight.

---

- **the `controls.show` option**

Set this option to `true` or `false`.

This library includes a control panel for users to control the master volume and mute state. You can determine whether or not you want to use it or roll your own (or not include options, you Philistine).

---

- **the `controls.startClosed` option**

Set this option to `true` or `false`.

The control panel slides in and out from the side of the screen. Use this option if you want to start it closed (taking up very little space).

---

- **the `controls.volumeDisplay` option**

Set this option to `true` or `false`.

Determines whether a text readout of the current volume is displayed next to the volume control.

---

- **the `loadLimit.track` option**

Set this option to number of milliseconds.

Use this option to set a tolerance (in MS) for how long the preloading function will wait attempting to load a single track before moving on. In combination with the below option, this setting should be used to make sure the game doesn't just hang forever on slower connections.

---

- **the `loadLimit.total` option**

Set this option to number of milliseconds.

Use this option to set a tolerance (in MS) for how long the preloading function will wait attempting to load all of the tracks before dismissing the load screen. In combination with the above option, this setting should be used to make sure the game doesn't just hang forever on slower connections.

---

## Tracks

Tracks are the meat and potatoes of this library: everything you do is with tracks. Setting up your tracks should be done early, and you have a few options: use [a `startup`-tagged passage](https://twine2.neocities.org/#passagetag_startup) and `<script>` elements, or write the track definitions in JavaScript (but after the library).

To setup a track, use the `A.newTrack()` method, and provide your track a name and at least one source.  For example:

```javascript
A.newTrack('piano', 'http://www.kozco.com/tech/piano2.wav');
```

You can also use a script element in a `startup`-tagged passage:
```
:: audio-init [startup]
<script>
A.newTrack('theme', 'audio/theme.mp3');
A.newTrack('beep', 'audio/beep.mp3');
</script>
```

The *sources* of your audio files are urls or paths to the audio resources. These can be relative paths or absolute paths, depending on your needs.

You should try to provide multiple sources to each sound: they'll be the same sound, just in different file formats, to help improve browser support. For example, most browsers can play `.mp3` files just fine, but Chromium users can't without a special plug-in they may not have. But they can play `.ogg` files, but Safari doesn't support `.ogg`...

```javascript
A.newTrack('theme', 'audio/theme.mp3', 'audio/theme.ogg');
```

If you pass multiple files, only one will be loaded, but the library will look for the first one on the list the browser can use.

You can pass these sources as an array instead of discreet arguments if you prefer:

```javascript
A.newTrack('theme', ['audio/theme.mp3', 'audio/theme.ogg']);
```

Either way works fine.

If you're loading a lot of audio, consider including the `A.preload()` method below it, to show a loading screen while that's happening.

```
:: audio-init [startup]
<script>
A.newTrack('theme', 'audio/theme.mp3');
A.newTrack('beep', 'audio/beep.mp3');
A.preload(); // shows a load screen and dismisses it when the audio has loaded
</script>
```

Once you have some tracks set up and named, you're ready to do things with them!

## Track Methods

You can use `A.track()` to access your track, and then use methods like `fadeIn()`, `volume()`, `play()`, and `stop()` to control the track. For instance:

```
(link: 'Start the Game')[
    <script>A.track('theme').loop(true).play();</script>
    (goto: 'the beginning')
]
```

Note that most browsers will not play any sound before the user interacts with the page. Once sound plays once, however, you can play sounds without worrying about it, so a setup like the one above is generally wise when you're playing the first sound in your game. There are a few methods that can sneak around this, though, with varying degrees of success.

You'll also notice that we called two methods in a row: `loop()` and `play()`. This is called *method chaining*. You can't chain every method together, but the ones you can chain will be clearly marked.

---

- **the `<track>.play()` method**

- Arguments: none.

- Returns: the track (chainable).

Attempts to start playback of the named track.

---

- **the `<track>.playWhenPossible()` method**

- Arguments: none.

- Returns: the track (chainable).

Attempts to start playback of the named track as soon as a user interaction occurs. This track will piggyback off of any click to start the sound, and will "unlock" audio autoplay for the rest of your game.

---

- **the `<track>.pause()` method**

- Arguments: none.

- Returns: the track (chainable).

Pauses playback of the track.

---

- **the `<track>.stop()` method**

- Arguments: none.

- Returns: the track (chainable).

Stops the track (ends playback and resets its to the beginning).

---

- **the `<track>.loop(bool)` method**

- Arguments: 
    - `bool`: (boolean) if `true` sets the track to loop, if `false` sets it to not loop.

- Returns: the track (chainable).

Sets the track to loop or stops it from looping.

---

- **the `<track>.toggleLoop()` method**

- Arguments: none.

- Returns: the track (chainable).

Sets the track to loop if it isn't looping, or stops it from looping if it is looping.

---

- **the `<track>.seek(time)` method**

- Arguments: 
    - `time`: (number) a time in seconds.

- Returns: the track (chainable).

Seeks to the indicated time in the track.

---

- **the `<track>.fadeIn(duration)` method**

- Arguments: 
    - `duration`: (number) a time in seconds.

- Returns: the track (chainable).

Starts playback, fading the track in from `0` to its current volume over the provided number of seconds.

---

- **the `<track>.fadeOut(duration)` method**

- Arguments: 
    - `duration`: (number) a time in seconds.

- Returns: the track (chainable).

Fades the track from its current volume to `0` over the provided number of seconds, then stops the track.

---

- **the `<track>.fadeTo(duration, level)` method**

- Arguments: 
    - `duration`: (number) a time in seconds.
    - `level`: (number) the target volume (between 0 and 1).

- Returns: the track (chainable).

Causes the track's volume to change from its current volume to the target volume `level` over the indicated number of seconds.

---

- **the `<track>.volume(level)` method**

- Arguments: 
    - `level`: (number) the target volume (between 0 and 1).

- Returns: the track (chainable).

Changes the track's volume.

---

- **the `<track>.mute(bool)` method**

- Arguments: 
    - `bool`: (boolen) if `true`, mutes the track; if `false`, unmutes it.

- Returns: the track (chainable).

Changes the track's mute state.

---

- **the `<track>.toggelMute()` method**

- Arguments: none.

- Returns: the track (chainable).

Mutes the track if it's unmuted, unmutes it if it's muted.

---

- **the `<track>.isPlaying()` method**

- Arguments: none.

- Returns: boolean.

Returns whether or not the track is currently playing. Muted and inaudible tracks count as playing.

---

- **the `<track>.isMuted()` method**

- Arguments: none.

- Returns: boolean.

Returns whether or not the track is currently muted.

---

- **the `<track>.isLooping()` method**

- Arguments: none.

- Returns: boolean.

Returns whether or not the track is currently set to loop.

---

- **the `<track>.getVolume()` method**

- Arguments: none.

- Returns: number (between 0 and 1).

Returns the track's current volume; this is the track's volume state and does not reflect any master volume adjustments.

---

## Master Audio Methods

The master audio methods are used for controlling *all* sound in the game at once. The master audio does not change you tracks, instead it overrides them. For example, if you have the `'theme'` track muted and the `'beep'` track unmuted, `A.mute(true)` will make `'beep'` silent. `A.mute(false)` will not make `'theme'` audible, however. None of these methods are chainable.

---

- **the `A.mute(bool)` method**

- Arguments:  
    -`bool`: (boolen) if `true`, mutes all audio; if `false`, unmutes all audio.

- Returns: none.

Controls the master mute and unmute state.

---

- **the `A.volume(level)` method**

- Arguments:  
    -`level`: (number) a volume level between `0` and `1`.

- Returns: none.

Adjusts the master volume level.

---

- **the `A.stopAll()` method**

- Arguments: none.

- Returns: none.

Stops every track that is currently playing.

---

- **the `A.audioPlaying()` method**

- Arguments: none.

- Returns: boolean.

Returns `true` is any audio at all is playing.

---

- **the `A.isMuted()` method**

- Arguments: none.

- Returns: boolean.

Returns the state of the master mute.

---

- **the `A.getVolume()` method**

- Arguments: none.

- Returns: number (between 0 and 1).

Returns the current level of the master volume.

---

- **the `A.clearPrefs()` method**

- Arguments: none.

- Returns: none.

Clears any user preferences that are saved in local storage.

---

- **the `A.preload()` method**

- Arguments: none.

- Returns: none.

Shows a loading screen while all previously defined tracks are cached by the browser. Can be used to completely or selectively preload audio before the game starts.

---

## Groups

Groups are ways to collect and organize tracks, but should *not* be confused with playlists (read on for those). These are designed to allow you to select and control a large number of tracks and do something to them. The methods used by groups are very similar to some of the track methods, but as said, generally do something to all of them at once.

There are two built-in groups, `'playing'` and `'looping'`, that can be used to control all currently playing and looping tracks. Additionally, you can define your own groups with `A.createGroup()`:

```javascript
A.createGroup('ui-sounds', 'beep', 'click', 'no');
```

The above code will create a new group called `'ui-sounds'`, with the tracks `'beep'`, `'click'`, and `'no'` as its members.

You can then act on those sounds with `A.group()`. For example, you might create a setting in your game that allows the user to mute all UI audio sounds like clicks and beeps by creating the group, then:

```
{
(link: 'Mute UI Sounds')[
    <script>A.group('ui-sounds').mute(true);</script>
]
}
```

## Group Methods

The methods you can use on groups are a smaller subset of the same ones you can use on tracks. All of these methods are chainable.

---

- **the `<group>.play()` method**

- Arguments: none.

- Returns: the group (chainable).

Attempts to play every sound in the group. At once. Probably not useful, but included for completeness.

---

- **the `<group>.pause()` method**

- Arguments: none.

- Returns: the group (chainable).

Pauses all the tracks in the group.

---

- **the `<group>.stop()` method**

- Arguments: none.

- Returns: the group (chainable).

Stops all the sounds in the group.

---

- **the `<group>.mute(bool)` method**

- Arguments:  
    -`bool`: (boolen) if `true`, mutes the tracks; if `false`, unmutes them.

- Returns: the group (chainable).

Mutes or unmutes every track in the group.

---

- **the `<group>.volume(level)` method**

- Arguments:  
    -`level`: (number) a volume level between `0` and `1`.

- Returns: the group (chainable).

Adjusts all the volumes of all the tracks in the group.

---

- **the `<group>.loop(bool)` method**

- Arguments:  
    -`bool`: (boolean) if `true`, sets all the tracks to loop; if `false`, stops them from looping.

- Returns: the group (chainable).

Set the tracks to loop or stop them from looping.

---

## Playlists

Playlists are another way to group tracks, but have some special properties. Namely, each playlist itself can be looped (so that they play their tracks in order, then start over again from the first track afterward), and they can be used to select and play random tracks.

You create playlists with the `A.createPlaylist()` method.

```javascript
A.createPlaylist('bgmusic', 'theme', 'cool-song', 'techno');
```

The above script will create a playlist named `'bgmusic'`, with `'theme'`, `'cool-song'`, and `'techno'` as its tracks.

You can access and work on the playlist with the `A.playlist()` method:

```javascript
A.playlist('bgmusic').loop(true).shuffle().play();
```

The above code would cause the `'bgmusic'` to shuffle its tracks, then play them through on a loop.

## Playlist Methods

Like groups, playlists receive a subset of track methods, along with a few methods of their own. Most of these methods are chainable.

---

- **the `<playlist>.play([start])` method**

- Arguments:  
    - `start`: (optional) (number) the track to start at, list is 0-based

- Returns: the playlist (chainable).

Plays the playlist. Every track will be played in order, one after another. You can optionally start at any one of the tracks by providing a number (0 will be the first track).

---

- **the `<playlist>.pause()` method**

- Arguments: none.

- Returns: the playlist (chainable).

Pauses the playlist's playback.

---

- **the `<playlist>.stop()` method**

- Arguments: none.

- Returns: the playlist (chainable).

Stops the playlist.

---

- **the `<playlist>.loop(bool)` method**

- Arguments:  
    - `bool`: (boolean) causes the playlist to repeat after it ends if `true`.

- Returns: the playlist (chainable).

Set the playlist to loop (not each track inside) or set it to stop looping.

---

- **the `<playlist>.random()` method**

- Arguments: none.

- Returns: a track.

Returns a random track from the playlist--you can then use [track methods](#track-methods) on it.

---

- **the `<playlist>.shuffle()` method**

- Arguments: none.

- Returns: the playlist (chainable).

Shuffles (randomizes) the playlist. Be warned: the default order cannot be restored without creating a new playlist.

---

- **the `<playlist>.isPlaying()` method**

- Arguments: none.

- Returns: boolean.

Returns true if the playlist is currently being played in some fashion.

---

## Control Panel

?> **Note:** These APIs are completely unavailable if `options.controls.show` is `false`.

The control panel is a user interface for controlling the audio that is set up through this library. You can use it to give your players a mute button and a volume control without having to build these functions yourself.

You may wish to alter the panels CSS to math your game. [Look here](https://github.com/ChapelR/harlowe-audio/blob/master/src/panel.css) to check out it's default styles.

Some facets of the control panel can be controlled via JavaScript using the following methods:

---

- **the `A.controls.close()` method**

- Arguments: none.

- Returns: none.

Closes (shrinks) the panel.

---

- **the `A.controls.open()` method**

- Arguments: none.

- Returns: none.

Opens (expands) the panel.

---

- **the `A.controls.hide()` method**

- Arguments: none.

- Returns: none.

Hides the panel completely.

---

- **the `A.controls.show()` method**

- Arguments: none.

- Returns: none.

Makes the panel visible after hiding it.

---

## Load Screen

This library adds a loading screen to Harlowe that is superficially similar to SugarCube's. You can use this load screen by calling the `A.preload()` method after defining some tracks. You can potentially use it for other things too, if you want. Show it by calling `A.loadScreen.show()`, and get rid of it with `A.loadScreen.dismiss()`. That's really all there is to it.

## The Menu API

?> **Note:** These APIs are completely unavailable if `options.controls.show` is `false`.

?> **TODO:** Add this to the API section. Improve this aspect of the demo. Write code examples.

This API allows you to add links to the sidebar as a 'story menu', similar to what can be done in SugarCube. THese links can be used to navigate to a passage, run a JavaScript function, or both. They can be hidden, shown, toggled, and removed at any time.

---

- **the `A.menu.hide()` method**

- Arguments: none.

- Returns: the `#story-menu` element (jQuery).

Hides the story menu portion of the side bar.

---

- **the `A.menu.show()` method**

- Arguments: none.

- Returns: the `#story-menu` element (jQuery).

Shows the story menu portion of the side bar.

---

- **the `A.menu.isShown()` method**

- Arguments: none.

- Returns: boolean.

Returns whether the story menu portion of the side bar is currently visible.

---

- **the `A.menu.links.add(linkText, [passageName], [callback])` method**

- Arguments: 
    - `linkText`: (string) the text of the link.
    - `passageName`: (optional) (string) a passage name to navigate to when the link is clicked.
    - `callback`: (optional) (string) a function to run when the link is clicked.

- Returns: the generated link (jQuery).

This method creates a story menu link. You must pass it text to display or it will raise an error. You can then pass it a passage name to navigate to, a callback function to run on click, both, or neither. If you include both, they must be included in the indicated order.

---

- **the `A.menu.links.clear()` method**

- Arguments: none.

- Returns: the `#story-menu` element (jQuery).

This method removes all of the links from the story menu.

---

- **the `A.menu.links.hide(text)` method**

- Arguments: 
    -`text`: the text of the link you want to alter.

- Returns: nothing.

This method hides a story menu link. If there are multiple links with the same link text, all of them will be hidden.

---

- **the `A.menu.links.show(text)` method**

- Arguments: 
    -`text`: the text of the link you want to alter.

- Returns: nothing.

This method shows a hidden story menu link. If there are multiple links with the same link text, all of them will be shown.

---

- **the `A.menu.links.toggle(text)` method**

- Arguments: 
    -`text`: the text of the link you want to alter.

- Returns: nothing.

This method toggles the visibility a story menu link (hiding it if it's visible, showing it if it is hidden). If there are multiple links with the same link text, all of them will be toggled.

---

- **the `A.menu.links.remove(text)` method**

- Arguments: 
    -`text`: the text of the link you want to alter.

- Returns: nothing.

This method removes a story menu link. If there are multiple links with the same link text, all of them will be removed. Hidden links can be re-shown later, removed links are gone for good and will need to be recreated via `A.menu.links.add()`.

---

# Events

There are two kinds of events that are triggered by HAL--events triggered on the document *only* and events triggered on *both* the track element and the document.

## Event Handlers

It is recommended that you write events using [jQuery's `on()`](http://api.jquery.com/on/) or [`one()` methods](http://api.jquery.com/one/). For example:

```javascript
$(document).on(':volume', function (ev) {
    console.log('track "' + ev.track.$el.attr('data-track') + '"" volume changed');
});
```

```javascript
A.track('some-song').$el.one(':volume', function () {
    console.log('track "some-song" volume changed');
});
```

## List of Track Events

These events are triggered on both the document and the track element. The track's definition is available as `<event>.track`.

- `:available` -> a track's metadata is loaded  
- `:loaded` -> a track can be played from start to finish  
- `:play` -> a track starts playing  
- `:pause` -> a track is paused  
- `:stop` -> a track reaches the end or is stopped  
- `:mute` -> a track is muted or unmuted  
- `:volume` -> a track's volume is changed

## Other Events

- `:master-mute` -> the master mute control is muted or unmuted  
- `:master-volume` -> the master volume is changed

---

# Detailed Examples

Some more detailed examples and explanations of common use-cases.

## Loading Audio Over the Network

You can use urls that point to audio file (i.e. they end in an audio file extension like `.wav` or `.ogg`) to set up a track.  For example:

```javascript
A.newTrack('theme', 'http://www.kozco.com/tech/piano2.wav', 'http://www.kozco.com/tech/piano2.aif');
```

## Loading Audio with Relative Paths

You can load audio with a **relative path**. A relative path is one that is resolved from where your file is located. Here's an [explanation](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL#Absolute_URLs_vs_relative_URLs). Note that relative paths will only work with published HTML files--they won't work correctly from the Twine 2 application's test and play modes.

```javascript
A.newTrack('beep', 'audio/beep.mp3', 'audio/beep.ogg');
A.newTrack('cool-song', 'audio/cool.mp3', 'audio/cool.ogg');
A.newTrack('techno', 'audio/techno.mp3', 'audio/techno.ogg');
```

[More information on adding media to your Twine game.](https://twinery.org/wiki/twine2:add_an_image_movie_sound_effect_or_music)

## Preloading Sound

By default, [the `preload` configuration option](#configuration) is `true`, and your game will attempt to preload all the audio it needs. This will make the game feel unresponsive and strange until loading completes You can show a loading screen during this time by using the `A.preload()` method, which may be preferable to an unresponsive page.

You can speed up initial loading and skip that sloppiness altogether by shutting off preloading, but the risk there is that sounds won't be ready when they're called the first time. That nice crisp beep when you click? Half a second late. The awesome theme tune timed to a slick CSS animation? Not so slick now.

Regardless, on subsequent plays, a given user shouldn't have either problem, as the data should be cached in their browser.

## Autoplaying Sound

**Autoplaying** refers to playing a sound (or video) *before* the user interacts with a page. Autoplaying is widely considered annoying, especially on mobiles. However, you've made a game--most users will expect autoplaying sound! It doesn't matter to most browser manufacturers.

There's no way to fake out autoplay, but once your document has permission to play a single sound, autoplay will work from then on out.

For example, if the following is how you play your first bit of audio, it won't work in some browsers:

```
<script>A.track('theme').play();</script>
```

You have two options. The first is to simply tie the first sound you play to a `(link:)` of some kind. You may want to add a splash screen to your story to do this:

```
#My Awesome Game

(link: 'Start')[
    <script>A.track('theme').play();</script>
    (goto: 'real first passage')
]
```

The second is to use the `playWhenPossible()` method, which will listen for valid user interactions, and then piggyback off of them to play a sound.

```
<script>A.track('theme').playWhenPossible();</script>
```

Once it detects a user interaction, control over sound will be unlocked for your game.

## Playing a Sound Only if It isn't Already Playing

If the user is jumping around in your story using the undo or redo features of Harlowe, or if they can get to a scene in multiple ways at different times, you may want to use some [`(if:)`s](https://twine2.neocities.org/#macro_if) or [`(unless:)`s](https://twine2.neocities.org/#macro_unless) along with the `<track>.isPlaying()` method to make sure the sound you want to play isn't already playing.

```
(unless: A.track('theme').isPlaying())[
    <script>A.track('theme').loop(true).play();</script>
]
```

Or

```
(if: not (A.track('theme').isPlaying()))[
    <script>A.track('theme').loop(true).play();</script>
]
```

In some cases, like a major theme switch, where you already had music playing, you may need to do a bit more work, and make sure to stop any sounds that were already playing before playing more tracks.

```
(unless: A.track('theme').isPlaying())[
    <script>
        A.stopAll();
        A.track('theme').loop(true).play();
    </script>
]
```

If you've already set up all your music tracks in a group, you can potentially do something even better, preventing potentially stopping other tracks, like UI noises or ambiance:

```javascript
A.newTrack('theme', 'http://www.kozco.com/tech/piano2.wav');
A.newTrack('beep', 'audio/beep.mp3', 'audio/beep.ogg');
A.newTrack('cool-song', 'audio/cool.mp3', 'audio/cool.ogg');
A.newTrack('techno', 'audio/techno.mp3', 'audio/techno.ogg');

A.createGroup('bgmusic', 'theme', 'cool-song', 'techno');
```

Then:

```
(unless: A.track('theme').isPlaying())[
    <script>
        A.group('bgmusic').stop();
        A.track('theme').loop(true).play();
    </script>
]
```

## Looping Background Music

The `<track>.loop()` method can be used to make music loop. If all you're after is a a backing track, this is all you need. Just place it in your JavaScript (after the library) or in a `<script>` in a `startup`-tagged passage element:

```javascript
A.newTrack('theme', 'url/to-you-track.mp3')
A.track('theme').loop(true).playWhenPossible();
```

That's it; you're done.

## Fading Music in and Out

A nice fade goes a long way.

```javascript
A.track('cool-song').loop(true).fadeIn(2);
```

This will fade `'cool-song'` in over two seconds and loop it.

You can also fade music out:

```javascript
A.track('cool-song').fadeOut(6);
```

This will fade the song out over six seconds and stop it when the fade is over.

To fade one song out and another one in:

```
{
<script>A.track('cool-song').fadeOut(2);</script>
(live: 2s)[
    <script>A.track('theme').fadeIn(2);</script>
]
}
```

The above passage code will cause the `'cool-song'` track to fade out over two seconds, and the `'theme'` track to fade in over two seconds immediately afterward.

You can also use the *top-secret* `<track>.delay()` method if you're comfortable with JavaScript:

```javascript
A.track('cool-song').fadeOut(2);
A.track('theme').delay(2000, function () { this.fadeIn(2) });
```

## Playing a Random Sound

You can play a random sound from a predefined list by making a playlist:

```javascript
A.newTrack('beep', 'audio/beep.mp3', 'audio/beep.ogg');
A.newTrack('click', 'audio/click.mp3', 'audio/click.ogg');
A.newTrack('scream', 'audio/scream.mp3', 'audio/scream.ogg');

A.createPlaylist('noises', 'beep', 'click', 'scream');
```

Then:

```
{
(link-repeat: 'Play a noise')[
    <script>A.playlist('noises').random().play();</script>
]
}
```

The `<playlist>.random()` method returns one random track from the playlist, and you can then use any [track methods](#track-methods) on it.

## Playing Sounds when Links are Clicked

Placing a `<script>` element with the method you need inside a `(link:)` (or similar) macro will allow you to play sounds on click.

```
[[Boring Link|some passage]]

{
(link: 'Exciting Link')[
    <script>A.track('beep').play();</script>
    (goto: 'some passage')
]
}
```

## Adjusting the Volume of a Sound

Tracks can have individual volumes to help you balance out sounds, or make some faint.

```javascript
A.track('beep').volume(0.5);
```

Volume levels are numbers between 0 and 1 (inclusive), so 0.5 is half volume. By default tracks have a volume of 1.

## Have ideas?

[Open an issue](https://github.com/ChapelR/harlowe-audio/issues/new) to suggest more examples, or for clarification on existing ones.

# Pitfalls

There are a few things to know and avoid when using JavaScript in Harlowe.

## `<script>` elements are processed (very) late.

 `<script>` elements are *not* processed in the order they are encountered, but rather they are always processed last--after all passage code. Even when they're in `startup`- or `header`-tagged passages, they will be processed after **all** macro code. This can create weird issues. Consider the following:

```
:: audio-init [startup]
<script>
    A.newTrack('piano', 'http://www.kozco.com/tech/piano2.wav');
    A.preload();
</script>

:: Start
(print: A.track('piano').isPlaying())
<script>A.track('piano').loop(true).playWhenPossible();</script>
```
You would probably expect the `(print:)` there to print `false`; instead, it will throw an error (`cannot read property isPlaying of undefined`) because our script is processed late.

You can abuse the set macro, however to run code in order:

```
:: audio-init [startup]
(set: _dummy to A.newTrack('piano', 'http://www.kozco.com/tech/piano2.wav'))
(set: _dummy to A.preload())

:: Start
(print: A.track('piano').isPlaying())
<script>A.track('piano').loop(true).playWhenPossible();</script>
```

The `(set:)` will force the function to be evaluated in order, and the `(print:)` will print `false` as expected. However, this is a hack, and may not be possible in future versions of Harlowe.

I generally recommend using `<script>` elements where ever possible, and only resorting to this trick when there's no other easy way to achieve the desired results.

## Use caution when altering tracks in multiple ways.

When you do something to the same track(s) with its playlist, its group, or its track methods at one time, you're asking for trouble. Even though tracks can be part of groups and playlists, I opted **not** to clone the tracks; there is only ever one track, and this means **all changes to the track are essentially "global"** and will effect the track regardless of how you interact with it.

This may not always be the case, but this seemed like it gave tracks a much more consistent and expected behavior. Adding cloned version of tracks for at least playlists is on the table, though, so let me know [via an issue](https://github.com/ChapelR/harlowe-audio/issues/new) if you feel that makes more sense.

## Prefer track methods when possible.

Collections are always slower, and this is true with tracks, too. Whenever it would make sense to use more than one kind of method, always prefer track methods, as they are *much* faster.

## Master controls are user controls.

Note that the state of the master controls (mute and volume) are intended for your players to adjust, not for the developer. You *can* use them, but they're generally a poor way to achieve most results. For this reason, I would suggest always using group methods to adjust volume or mute state for a group of tracks (or even all tracks, if it comes to that) rather than the master controls. Remember that tracks can be members of multiple groups. This is why the group interface exists in the first place.

# Extensions

You can build or import JavaScript-based extensions into this library using special funcitons designed to add features without clobbering existing stuff. For example, if you wanted to make a method for tracks that returned their names, you could use the `A.extendTrackProto()` method, and pass it an object containing the new method. For example:

```javascript
A.extendTrackProto({
    getName : function () {
        return this.id;
    }
});
```

Then you can use it just like any other track method:

```javascript
var trackName = A.playlist('bgm').random().getName();
```

You can add multiple properties at once, but if a property name that is already taken is encountered, an error will be thrown.

```javascript
A.extendTrackProto({
    getName : function () {
        return this.id;
    },
    loop : true // error!
});
```

These functions are probably most useful for people already experienced with JavaScript, but will allow me (and potentially other devs) to quickly add features for people without rebuilding the entire library.

[Example extensions.](https://gist.github.com/ChapelR/57655e2a9a75352c70cf7d605858d7c7)

## Extension Method List

The following is a complete list of the extension methods available for use:

---

- **the `A.extend(obj)` method**

- Arguments:  
    - `obj` (object) an object containing the properties and methods you want to add.

- Returns: none.

Safely adds properties and methods to the `A` / `Chapel.Audio` object.

---

- **the `A.extendTrack(obj)` method**

- Arguments:  
    - `obj` (object) an object containing the properties and methods you want to add.

- Returns: none.

Safely adds properties and methods to the Track constructor (e.g. static methods).

---

- **the `A.extendTrackProto(obj)` method**

- Arguments:  
    - `obj` (object) an object containing the properties and methods you want to add.

- Returns: none.

Safely adds properties and methods to Track instances (e.g. instance methods).

---

- **the `A.extendGroup(obj)` method**

- Arguments:  
    - `obj` (object) an object containing the properties and methods you want to add.

- Returns: none.

Safely adds properties and methods to the Group constructor (e.g. static methods).

---

- **the `A.extendGroupProto(obj)` method**

- Arguments:  
    - `obj` (object) an object containing the properties and methods you want to add.

- Returns: none.

Safely adds properties and methods to Group instances (e.g. instance methods).

---

- **the `A.extendPlaylist(obj)` method**

- Arguments:  
    - `obj` (object) an object containing the properties and methods you want to add.

- Returns: none.

Safely adds properties and methods to the Playlist constructor (e.g. static methods).

---

- **the `A.extendPlaylistProto(obj)` method**

- Arguments:  
    - `obj` (object) an object containing the properties and methods you want to add.

- Returns: none.

Safely adds properties and methods to the Playlist instances (e.g. instance methods).

---