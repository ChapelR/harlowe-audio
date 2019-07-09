## HAL is an Audio Library for Harlowe

[Try out the demo.](./demo/ ':ignore')

HAL is an audio library for [Harlowe (v2.1.0 or higher)](https://twine2.neocities.org/) designed to give the format feature parity (or close to it) with [SugarCube's audio subsystem](http://www.motoslave.net/sugarcube/2/docs/#simpleaudio-api). HAL was designed from the ground up *specifically* for use with Harlowe, and is intended to be as easy to use as possible for novice programmers without compromising functionality.

## Features

- All the core features you'd expect from such a library: playing across passages, fading, looping, individual track volume levels, etc.
- Support for audio playlists.
- Support for "audio groups," which let authors control track settings on groups of related tracks all at once.
- Includes an optional, user-configurable sidebar with built-in controls, like a master volume control and a master mute button.
- Supports preloading of audio, with an optional loading screen.
- Highly configurable and extensible for users who need it, with sane defaults and a bevy of built-in features for users who don't want to mess with any of that.

In v2.0.0 and higher:
- A set of custom audio macros to simplify usage.
- HAL uses *special passages* for configuration options and allows users to optionally use a special passage to define tracks, further simplifying the usage of HAL.

## Getting the Library

You can download any version of HAL from [here](https://github.com/ChapelR/harlowe-audio/releases). If you're just getting started, it's highly recommended that you grab the latest version. Once you've downloaded HAL, you'll need to read the [documentation](v2) (click [here](v1) for the v1 docs) to learn how to use it.

There are two main version of HAL. The latest version 2 release is recommended for most users. If you're already using version 1 in your project, you don't have to update if you don't want to and can instead grab the latest version 1 release.

## Quick Links

- [Downloads](https://github.com/ChapelR/harlowe-audio/releases)
- [Changelog](changelog)
- [Demo](./demo/ ':ignore')


- [HAL v2 Documentation](v2)
  - [Installation](v2#installation)
  - [Overview](v2#overview)
  - [Examples](v2#detailed-examples)


- [HAL v1 Documentation](v1)
  - [Installation](v1#installation)
  - [Examples](v1#detailed-examples)
