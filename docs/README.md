# Getting Started

## Introduction

This is an audio library designed for the [Twine 2](https://twinery.org/) story format [Harlowe (v2.1.0 or later)](https://twine2.neocities.org/). It is the successor [to howler-for-harlowe](https://github.com/ChapelR/howler-for-harlowe) which will likely not be seeing any further updates.

## Installation

All you need to install this library is the code. There are two ways to get it: [copy and pasting from GitHub](https://github.com/ChapelR/harlowe-audio/tree/master/dist), or [via a Google Drive download](#drivelink). If you download the code, be sure to open it and mess with it in a text editor, *not* a word processor. Once you've got the code, you'll need to put in in you project.

**In Twine 2 (online or standalone)**, copy and paste the code in `harlowe-audio.min.js` into your [Story JavaScript area](https://twinery.org/wiki/twine2:adding_custom_javascript_and_css), and the code in `harlowe-audio.min.css` into your Story Stylesheet area.

**In Tweego or Entwine/Grunt-Entwine**, include the files in your command-line options or in your source code directory as appropriate. Remember to watch your file order, and refer to your comiler's docs if you need help.

**In Twee2**, create a special passage with the `script` tag and place the JavaScript code in that passage, and do the same thing with the CSS and a `style` tag. Refer to its [docs](https://dan-q.github.io/twee2/documentation.html#twee2-syntax-special-passages) for more.

# Overview

The following sections will describe what exactly you can do with this library and how.

## Configuration

If you take a look at the code of `howler-audio.min.js`, you'll see the `options` object near the top of the script, which you can use to configure the library to meet your needs. It looks like this:

```javascript
var options = {
    preload : true,
    muteOnBlur : true,
    startingVol : 0.5,
    storagekey : '%%tw-audio',
    persistPrefs : true,
    controls : {
        show : true,
        startClosed : true
    }
};
```

---

- **the `preload` option**

Set this option to `true` or `false`.

Controls whether audio should be preloaded when the game is started, or if audio should only be loaded as needed. In most cases, you'll want to preload it.

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

- **the `controls.show` option**

Set this option to `true` or `false`.

This library includes a control panel for users to control the master volume and mute state. You can determine whether or not you want to use it or roll your own (or not include options, you Philistine).

---

- **the `controls.startClosed` option**

Set this option to `true` or `false`.

The control panel slides in and out from the side of the screen. Use this option if you want to start it closed (taking up very little space).

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

- **the `<track>.forcePlay()` method**

- Arguments: none.

- Returns: the track (chainable).

Attempts to start playback of the named track without user interaction. Does not work in some browsers, and not a great way to start playback, for the most part.

---

- **the `<track>.playWhenPossible()` method**

- Arguments: none.

- Returns: the track (chainable).

Attempts to start playback of the named track as soon as a user interaction occurs. This track will piggyback off of any click to start the sound. This is better than `forcePlay()` for most things.

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

## Groups

## Playlists

## Control Panel

# Detailed Examples

Some more detailed examples of common use-cases.

# API Reference

This part of the docs is intended for those more comfortable with JavaScript code. You don't really need to read it to use the library on a basic(ish) level, so don't worry if it's a bit over your head.

## Audio Methods and Properties

## Audio.group()

## Audio.track()

## Audio.playlist()

## Audio.classes

## Track Methods

### Static

### Instance

## Playlist Methods

### Static

### Instance

## Group Methods

### Static

### Instance

## Audio Events

## Audio.controls