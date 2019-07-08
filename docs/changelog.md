## v2 Series Releases

### v2.0.0

This version of HAL includes a vast array of usability improvements, including the introduction of special passages, audio macros, and a variety of other features.

I took the opportunity to rewrite large swathes of HAL for this release, meaning some code written for previous versions of HAL may no longer work correctly, hence the major version bump. In addition, since the recommended way to use HAL has changed so dramatically, this version also required a massive documentation rewrite.

- Added several macros that allow users to interact with HAL using TwineScript. The macros are: `(newtrack:)`, `(newplaylist:)`, `(newgroup:)`, `(masteraudio:)`, `(track:)`, `(playlist:)`, and `(group:)`.
- Users may now optionally define their tracks in a special passage called `hal.tracks` using the format `trackName: source, source, etc...`; each track definition must go on its own line.

## v1 Series Releases

### v1.3.0

This version of HAL should address most issues related to Harlowe v3's refresh/reload persistence for tracks, playlists, and groups. The Menu API calls still need to be set up in Story JavaScript; there's simply too much that can go wrong there.

- Added session persistence for `track`, `playlist`, and `group` instances.
- Fixed a bug with `track#one()`.
- Updated documentation.
- Other internal improvements and updates.

### v1.2.0

This version adds event handler methods to the `track` prototype and to the root `A` object.

- Added the `track#on()` and `track#one()` methods.
- Added the `A.on()` and `A.one()` methods.
- Updated the docs with the new event methods and an event section.
- Internal improvements.

### v1.1.2

This patch addresses an issue where `options.controls.show` was throwing on false.

The custom events emitted by HAL are now (somewhat) documented.

### v1.1.1

This patch addresses a bug in the *track#fadeTo()* method.

### v1.1.0

This version marks the first non-beta release version! Don't fear using this in production code anymore (or anymore than normal).

- Fixed preloading bugs on mobile.
- Cleaned up sidebar controls UI.
- Created API for accessing and editing the UI from user code; see the docs for the `A.menu` APIs.
- Fixed mobile UI scaling in the demo, but unfortunately it can't be fixed from within the library.
- Internal improvements.

## Beta Releases

### v1.0.1

- Fixed a bug with preloading in some browsers.
- Fixed a bug in the `A.createGroup()` method.
- Audio elements are now added to the DOM in the `div#audio-container` element.
- Minor internal improvements.
- Now has a demo.

### v1.0.0

- Added the extensions API.
- Added complete JavaScript API reference (still messy).
- Internal improvements.