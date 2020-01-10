(function () {
    'use strict';

    var A = Chapel.Audio;
    var Track = A.classes.Track;
    var Playlist = A.classes.Playlist;

    function _extend (api, newStuff) {
        if (typeof newStuff !== 'object') {
            throw new TypeError('Invalid extension.', 'extensions.js -> _extend()', 8);
        }
        Object.keys(newStuff).forEach( function (key) {
            if (api[key] !== undefined) {
                throw new Error('Invalid extension: cannot clobber existing property "' + key + '".', 'extensions.js -> _extend()', 8);
            }
            api[key] = newStuff[key];
        });
    }

    // root object
    A.extend = function (data) {
        _extend(Audio, data);
    };

    // tracks
    Track.extend = function (data) {
        _extend(Track, data);
    };
    Track.extendPrototype = function (data) {
        _extend(Track.prototype, data);
    };

    A.extendTrack = Track.extend;
    A.extendTrackProto = Track.extendPrototype;

    // groups
    A.group.extend = function (data) {
        _extend(A.group, data);
    };
    A.group.extendPrototype = function (data) {
        _extend(A.group.prototype, data);
    };

    A.extendGroup = A.group.extend;
    A.extendGroupProto = A.group.extendPrototype;

    // playlists
    Playlist.extend = function (data) {
        _extend(Playlist, data);
    };
    Playlist.extendPrototype = function (data) {
        _extend(Playlist.prototype, data);
    };

    A.extendPlaylist = Playlist.extend;
    A.extendPlaylistProto = Playlist.extendPrototype;
}());