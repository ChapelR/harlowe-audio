# Overview

The `window.A` (optionally) and the `window.Chapel.Audio` objects hold everything. The actual internal structure of these objects looks something like this:

```javascript
A = {
    loaded : [], // an array of track IDs that are loaded and currenlty playable
    classes : { // holds the constructor functions
        Track : function (){}, // the Track constructor
        Playlist : function (){} // the Playlist constructor
    },
    groups : { // the list of groups
        playing : [], // the built-in playing group
        looping : [], // the built-in looping group
        custom : {} // user-defined groups
    },
    master : { // the master audio control states
        mute : boolean, // the master mute state
        volume : number // the master volume state
    },
    // several methods
}
```

When you want to create a new Track, Playlist, or Group, you should generally do it through the `window.A` methods, not through the constructors. The method versions have error handling, smooth out issues, properly register things, provide references to other subsystems, etc. For example:

```javascript
var x = new A.classes.Track('my track', './track.mp3');
x.play(); //works
A.track('my track').play(); // doesn't work
```

The `A.newTrack()` method adds the track to the `A.classes.Track.list` data-structure and allows it to be looked up via `A.track()`.

Similarly, I reccomend adding extensions, like instance methods, via [the provided extensions API](/#extensions), not directly onto the constructors or their prototypes.

```javascript
// bad 
A.classes.Track.prototype.whatever = function () { return : 'hi'; };

// good
A.extendTrackProto({ whatever : function () { return 'hi'; } });
```

# Main Methods

Here is a list of all of the methods available on the main object (`A` / `Chapel.Audio`).

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

- **the `A.savePrefs()` method**

- Arguments: none.

- Returns: none.

Saves user preferences to local storage.

---

- **the `A.loadPrefs()` method**

- Arguments: none.

- Returns: none.

Loads user preferences from local storage.

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

- **the `A.newTrack(id, sources [, sources...])` method**

- Arguments:  
    - `id` (string) a name or id for the track; should be unique.  
    - `sources` (string|array) a list or array of audio sources.

- Returns: a track.

Creates a new `Track` instance with all the necessary plumbing.

---

- **the `A.track(id)` method**

- Arguments:  
    - `id` (string) the name or id of an existing track. 

- Returns: a track.

Gets and returns the track instance indicated by the id.

---

- **the `A.createGroup(id, tracks [, tracks...])` method**

- Arguments:  
    - `id` (string) a name or id for the group; should be unique.  
    - `tracks` (string|array) a list or array of tracks.

- Returns: a group.

Creates a new `group` instance with all the necessary plumbing.

---

- **the `A.group(id)` method**

- Arguments:  
    - `id` (string) the name or id of an existing audio group. 

- Returns: a group.

Gets and returns the group instance indicated by the id.

---

- **the `A.createPlaylist(id, tracks [, tracks...])` method**

- Arguments:  
    - `id` (string) a name or id for the playlist; should be unique.  
    - `tracks` (string|array) a list or array of tracks.

- Returns: a playlist.

Creates a new `Playlist` instance with all the necessary plumbing.

---

- **the `A.playlist(id)` method**

- Arguments:  
    - `id` (string) the name or id of an existing playlist. 

- Returns: a playlist.

Gets and returns the playlist instance indicated by the id.

---

# Tracks

Everything you ever wanted to know about Tracks.

## The Track Constructor

---

- **the `A.classes.Track(id, sources [, sources...])` constructor**

- Arguments:  
    - `id` (string) a name or id for the track; should be unique.  
    - `sources` (string|array) a list or array of audio sources.

- Returns: a track.

Creates a new `Track` instance, but provides little error handling and doesn't add the necessary plumbing to make tracks available to `A.track()` or any other methods, like the Playlist and group constructors.

---

## Static Methods

---

- **the `A.classes.Track.is(thing)` method**

- Arguments:  
    - `thing` (any) a thing to check.

- Returns: boolean.

Returns whether the provided *thing* is a Track instance.

---

- **the `A.classes.Track.has(id)` method**

- Arguments:  
    - `id` (string) the name or id of a track.

- Returns: boolean.

Returns whether a track with the indicated id exists or not.

---

- **the `A.classes.Track.emit(type, trackInstance)` method**

- Arguments:  
    - `type` (string) the type of custom event to emit.  
    - `trackInstance` (track) the track to provide to the event as `<event>.track`.

- Returns: nothing.

Emits a custom event on the `document` and on the audio element associated with the track.

---

- **the `A.classes.Track.add(id, sources [, sources...])` method**

- Arguments:  
    - `id` (string) a name or id for the track; should be unique.  
    - `sources` (string|array) a list or array of audio sources.

- Returns: a track.

Creates a new `Track` instance, and largely the same as `A.newTrack()`.

---

- **the `A.classes.Track.renew()` method**

- Arguments: nothing.

- Returns: nothing.

Reprocesses each track's volume and mute state. Used when the master audio controls are changed.

---

- **the `A.classes.Track.extend(obj)` method**

- Arguments:  
    -`obj` (object) an object containing the properties and methods you want to add.

- Returns: none.

Safely adds properties and methods to the Track constructor (e.g. static methods).

---

- **the `A.classes.Track.get(id)` method**

- Arguments:  
    - `id` (string) the name or id of a track.

- Returns: a track.

Returns the track instance with the indicated id.

---

- **the `A.classes.Track.getIdx(id)` method**

- Arguments:  
    - `id` (string) the name or id of a track.

- Returns: boolean.

Returns the index of the track with the given id in the `A.classes.Track.list` array.

---

## Properies

---

- **the `A.classes.Track.list` property**

An array of track instances set up via the `A.newTrack()` or `A.classes.Track.add()` methods.

---

## Instance Methods

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

- **the `<track>.emit(type)` method**

- Arguments:  
    - `type` (string) the type of event to emit.

- Returns: nothing.

Emits an event on the current track's audio element of the given type. Sends a reference to the track as `event.track`.

---

- **the `<track>.forcePlay()` method**

- Arguments: nothing.

- Returns: the track (chainable).

Forces the track to play on some browsers that don't normally allow autplay without user interaction. Works only on some browsers.

---

- **the `<track>.delay(time, callback)` method**

- Arguments:  
    - `time` (number) a number of milliseconds to wait.  
    - `callback` (function) a function to run after the time is up.


- Returns: nothing.

Used to fire a track method after some arbitrary about of time, then keep chaining it in the callback. For example:

```javascript
A.track('song').loop(true).fadeIn(2).delay(7000, function () { this.loop(false).stop() });
```

The current track is passed to the callback as `this` and as the function's first argument, so this also works:

```javascript
A.track('song').loop(true).fadeIn(2).delay(7000, function (self) { self.loop(false).stop() });
```

---

- **the `<track>.clone()` method**

- Arguments: nothing.

- Returns: a deep copy of the track.

You can call this method to make a deep copy or clone of a track.

---

- **the `<track>.attach()` method**

- Arguments: nothing.

- Returns: the track (chainable).

This method attaches the track's audio element to the page's `<body>`.

---

- **the `<track>.unattach()` method**

- Arguments: nothing.

- Returns: the track (chainable).

This method removes the track's audio element to the page's `<body>`.

---

- **the `<track>.addToGroup(groupID, custom)` method**

- Arguments:  
    - `groupID` (string) the id of an existing group.
    - `custom` (boolean) set to `true` if adding to a user-defined group 

- Returns: the track (chainable).

Adds the track to a group.

---

- **the `<track>.removeFromGroup(groupID, custom)` method**

- Arguments:  
    - `groupID` (string) the id of an existing group.
    - `custom` (boolean) set to `true` if adding to a user-defined group 

- Returns: the track (chainable).

Removes the track from a group.

---