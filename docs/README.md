# Getting Started

## Introduction

This is an audio library designed for the [Twine 2](https://twinery.org/) story format [Harlowe (v2.1.0 or later)](https://twine2.neocities.org/). It is the successor [to howler-for-harlowe](https://github.com/ChapelR/howler-for-harlowe) which will likely not be seeing any further updates.

## Installation

All you need to install this library is the code. There are two ways to get it: [copy and pasting from GitHub](https://github.com/ChapelR/harlowe-audio/tree/master/dist), or [via a Google Drive download](#drivelink). If you download the code, be sure to open it and mess with it in a text editor, *not* a word processor. Once you've got the code, you'll need to put in in your project.

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
    -`bool`: (boolen) if `true`, sets all the tracks to loop; if `false`, stops them from looping.

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

Like groups, playlists recieve a subset of track methods, along with a few methods of their own. Most of these methods are chainable.

---

- **the `<playlist>.play()` method**

- Arguments: none.

- Returns: the playlist (chainable).

Plays the playlist. Every track will be played in order, one after another.

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

## Control Panel

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

# Detailed Examples

Some more detailed examples of common use-cases.

## Loading Audio Over the Network

## Loading Audio with Relative Paths

## Playing a Sound Only if It isn't Already Playing

## Looping Background Music

## Fading Music in and Out

## Playing a Random Sound

## Playing Sounds when Links are Clicked

## Adjusting the Volume of a Sound

## Stopping All Playing Sounds

## Incidental Sound Effects

## Stopping One Sound and Playing Another

# API Reference

This part of the docs is intended for those more comfortable with JavaScript code. You don't really need to read it to use the library on a basic(ish) level, so don't worry if it's a bit over your head.

## Audio Methods and Properties

The `window.A` object is actually a reference to the `window.Chapel.Audio` object. This object contains the entire library, and has many methods and properties.

...coming soon

```
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
```