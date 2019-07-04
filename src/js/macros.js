(function () {
    'use strict';

    var A = Chapel.Audio;

    // commands should be mapped to methods, for now, commands ARE method names

    var macros = {
        // (newtrack: name, source [, source...])
        newtrack : function (name, sources) {
            sources = [].slice.call(arguments).slice(1);
            try {
                return A.newTrack(name, sources);
            } catch (err) {
                // these should be made into Harlowe errors at some point
                alert('Error in the (newtrack:) macro: ' + err.message);
            }
        },
        // (newplaylist: name, track [, track...])
        newplaylist : function (name, tracks) {
            tracks = [].slice.call(arguments).slice(1);
            try {
                return A.createPlaylist(name, tracks);
            } catch (err) {
                alert('Error in the (newplaylist:) macro: ' + err.message);
            }
        },
        // (newgroup: name, track [, track...])
        newgroup : function (name, tracks) {
            tracks = [].slice.call(arguments).slice(1);
            try {
                return A.createGroup(name, tracks);
            } catch (err) {
                alert('Error in the (newgroup:) macro: ' + err.message);
            }
        },
        // (track: name, command [, args...])
        track : function (track, command) {
            try {
                var _get = A.track(track);
                return _get[command].apply(_get, [].slice.call(arguments).slice(2));
            } catch (err) {
                alert('Error in the (track:) macro: ' + err.message);
            }
        },
        // (playlist: name, command [, args...])
        playlist : function (list, command) {
            try {
                var _get = A.playlist(list);
                return _get[command].apply(_get, [].slice.call(arguments).slice(2));
            } catch (err) {
                alert('Error in the (playlist:) macro: ' + err.message);
            }
        },
        // (group: name, command [, args...])
        group : function (gr, command) {
            try {
                var _get = A.group(gr);
                return _get[command].apply(_get, [].slice.call(arguments).slice(2));
            } catch (err) {
                alert('Error in the (group:) macro: ' + err.message);
            }
        }
    };

    window.Chapel.Macros.add(macros);
}());