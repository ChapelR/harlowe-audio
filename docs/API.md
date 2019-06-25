# Overview

The `window.Chapel.Audio` object is the root object of this library. The `globalA` [configuration option](/#configuration) sets `window.A` as a reference to the main object as long as it's undefined; we'll be using the `A` object throughout this document, but `Chapel.Audio` also works, and should be used if you've already defined a different `window.A` or if you've shut off the `globalA` option.

The internal structure of the object looks something like this:

```javascript
{
    loaded : [], // an array of track IDs that are loaded and currenlty playable
    classes : { // holds the constructor functions
        Track, // the Track constructor
        Playlist // the Playlist constructor
    },
    groups : { // the list of groups
        playing, // the built-in playing group
        looping, // the built-in looping group
        custom : {
            // user-defined groups go here
        } 
    },
    master : { // the master audio control states
        mute, // the master mute state
        volume // the master volume state
    },
    // several methods
}
```

When you want to create a new Track or Playlist you should do it through the `window.A` methods (e.g. `A.newTrack()`), not through the constructors. The method versions have error handling, smooth out issues, properly register things, provide references to other subsystems, etc. For example:

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

- **the `A.classes.Track.extendPrototype(obj)` method**

- Arguments:  
    -`obj` (object) an object containing the properties and methods you want to add.

- Returns: none.

Safely adds properties and methods to the Track prototype (e.g. instance methods).

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

## Instance Properties

---

- **the `<track>.id` property**

The track's id / name.

---

- **the `<track>.$el` property**

A reference to the track's audio element, wrapped in jQuery. Same as `$(<track>.unwrap)`.

---

- **the `<track>.unwrap` property**

A reference to the track's audio element. Same as `<track>.$el[0]`.

---

- **the `<track>.source` property**

An array of the tracks audio file sources.

---

## Track Audio Element Attributes

Track audio elements have a number of special HTML attributes:

---

- **the `data-track` attribute**

The track's name / id is stored in this attribute.

---

- **the `data-volume` attribute**

The track's volume is stored in this attribute. The actual volume attribute can't be trusted, because it gets changed by the master volume state.

---

- **the `data-mute` attribute**

The track's mute state is stored in this attribute. The actual mute state can't be trusted, because it gets changed by the master mute state.

---

# Groups

Unlike other contructors, the group constructor is just on `A.group()` and is called directly by user code. The actual data groups use is stored in the `A.groups` object. Use `A.createGroup()` to easily set them up.

## The Group Constructor

---

- **the `A.group(id)` constructor**

- Arguments:  
    - `id` (string) the name of a property in the `A.groups` or `A.groups.custom` objects. 

- Returns: a group instance.

Creates a new `Group` from the data associated with that group's id in the `A.groups` data structure.

---

## Static Methods

---

- **the `A.group.is(thing)` method**

- Arguments:  
    - `thing` (any) something to test. 

- Returns: boolean.

Returns whether the passed *thing* is a group.

---

- **the `A.group.runOnAll(groupInstance, methodName [, argsArray])` method**

- Arguments:  
    - `groupInstance` (group) a group.  
    - `methodName` (string) the name of a track method.  
    - `argsArray` (array) an array of arguments to pass to the method.

- Returns: nothing.

When given a valid group instance and a valid track method name, runs the method on every track in the group.

---

- **the `A.group.extend(obj)` method**

- Arguments:  
    -`obj` (object) an object containing the properties and methods you want to add.

- Returns: none.

Safely adds properties and methods to the group constructor (e.g. static methods).

---

- **the `A.group.extendPrototype(obj)` method**

- Arguments:  
    -`obj` (object) an object containing the properties and methods you want to add.

- Returns: none.

Safely adds properties and methods to the group prototype (e.g. instance methods).

---

## Instance Methods

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

- **the `<group>.run(methodName, args [, args...])` method**

- Arguments:   
    - `methodName` (string) the name of a track method.  
    - `args` (string|array) a list or array of arguments to pass to the method.

- Returns: the group (chainable).

When given a valid track method name, runs the method on every track in the group.

---

## Instance Properties

---

- **the `<group>.members` property**

An array of references to track instances that are in this group.

---

# Playlists

Playlists are a bit more complicated than groups.

## The Playlist Constructor

---

- **the `A.classes.Playlist(id, trackIDs [, trackIDs...])` constructor**

- Arguments:  
    - `id` (string) the name of the playlist to create.  
    - `trackIDs` (string|array) a list or array of track ids.

- Returns: a playlist instance.

Creates a new `Playlist` with the given id and adds the tracks provided. Like with Tracks, the Playlist constructor should generally not be called by user code.

---

## Static Methods

---

- **the `A.classes.Playlist.is(thing)` method**

- Arguments:  
    - `thing` (any) the thing to test.

- Returns: boolean.

Returns whether the passed *thing* is a Playlist instance.

---

- **the `A.classes.Playlist.add(id, trackIDs [, trackIDs...])` method**

- Arguments:  
    - `id` (string) the name of the playlist to create.  
    - `trackIDs` (string|array) a list or array of track ids.

- Returns: a playlist instance.

Creates a new `Playlist` with the given id and adds the tracks provided. This method gives the new playlist the necessary plumbing and functionality to interact with everything else.

---

- **the `A.classes.Playlist.extend(obj)` method**

- Arguments:  
    -`obj` (object) an object containing the properties and methods you want to add.

- Returns: none.

Safely adds properties and methods to the Playlist constructor (e.g. static methods).

---

- **the `A.classes.Playlist.extendPrototype(obj)` method**

- Arguments:  
    -`obj` (object) an object containing the properties and methods you want to add.

- Returns: none.

Safely adds properties and methods to the Playlist prototype (e.g. instance methods).

---

## Instance Methods

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

- **the `<playlist>.clone()` method**

- Arguments: none.

- Returns: a new playlist instance.

Creates and returns a deep copy of the playlist.

---

## Instance Properties

---

- **the `<playlist>.id` property**

The playlist's name / id.

---

- **the `<playlist>.tracks` property**

An array of references to the track instances in the playlist.

---

- **the `<playlist>.looping` property**

Boolean `true` if the playlist is set to loop, `false` otherwise.

---

- **the `<playlist>.playing` property**

Boolean `true` if the playlist is considered to be playing, `false` otherwise.

---

- **the `<playlist>.current` property**

The string id of the currently playing track, or an empty string if no tracks are playing.

---

# Other APIs

Now that the big ones are out of the way:

## The Controls API

### Methods

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

- **the `A.controls.toggle()` method**

- Arguments: none.

- Returns: none.

Toggles the panel between the opened and closed states.

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

### Properties

---

- **the `A.controls.$panel` property**

JQuery object referencing the entire control panel area.

---

- **the `A.controls.$volume` property**

JQuery object referencing the volume range input.

---

- **the `A.controls.$mute` property**

JQuery object referencing the mute button.

---

## The LoadScreen API

---

- **the `A.loadScreen.show()` method**

- Arguments: none.

- Returns: none.

Shows the loading screen.

---

- **the `A.loadScreen.dismiss()` method**

- Arguments: none.

- Returns: none.

Dismisses the loading screen.

---

- **the `A.loadScreen.kill()` method**

- Arguments: none.

- Returns: none.

Completely removes the loading screen from the DOM.

---

## The Menu API

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
    - `text`: the text of the link you want to alter.

- Returns: nothing.

This method hides a story menu link. If there are multiple links with the same link text, all of them will be hidden.

---

- **the `A.menu.links.show(text)` method**

- Arguments: 
    - `text`: the text of the link you want to alter.

- Returns: nothing.

This method shows a hidden story menu link. If there are multiple links with the same link text, all of them will be shown.

---

- **the `A.menu.links.toggle(text)` method**

- Arguments: 
    - `text`: the text of the link you want to alter.

- Returns: nothing.

This method toggles the visibility a story menu link (hiding it if it's visible, showing it if it is hidden). If there are multiple links with the same link text, all of them will be toggled.

---

- **the `A.menu.links.remove(text)` method**

- Arguments: 
    - `text`: the text of the link you want to alter.

- Returns: nothing.

This method removes a story menu link. If there are multiple links with the same link text, all of them will be removed. Hidden links can be re-shown later, removed links are gone for good and will need to be recreated via `A.menu.links.add()`.

---

# Events

## List of Track Events

| Event        | Description                                |
| ---          | ---                                        |
| `:available` | a track's metadata is loaded               |
| `:loaded`    | a track can be played from start to finish |
| `:play`      | a track starts playing                     |
| `:pause`     | a track is paused                          |
| `:stop`      | a track reaches the end or is stopped      |
| `:mute`      | a track is muted or unmuted                |
| `:volume`    | a track's volume is changed                |

## List of Master Audio Events

| Event            | Description                                 |
| ---              | ---                                         |
| `:master-mute`   | the master mute control is muted or unmuted |
| `:master-volume` | the master volume is changed                |

## Event Objects

Track event objects are given a `track` property, which contains the track instance that triggered the event.