(function () {
    'use strict';

    var A = Chapel.Audio;

    function isFn (thing) {
        return thing && typeof thing === 'function';
    }

    function getCommand (cmd, what) {
        if (!cmd || typeof cmd !== 'string') {
            return null;
        }
        cmd = cmd.toLowerCase().trim();

        switch (cmd) {
            // camelcase method names
            case 'isplaying':
                cmd = 'isPlaying';
                break;
            case 'playwhenpossible':
                cmd = 'playWhenPossible';
                break;
            case 'ismuted':
                cmd = 'isAMuted';
                break;
            case 'togglemute':
                cmd = 'toggleMute';
                break;
            case 'getvolume':
                cmd = 'getVolume';
                break;
            case 'islooping':
                cmd = 'isLooping';
                break;
            case 'toggleloop':
                cmd = 'toggleLoop';
                break;
            case 'fadein':
                cmd = 'fadeIn';
                break;
            case 'fadeout':
                cmd = 'fadeOut';
                break;
            case 'fadeto':
                cmd = 'fadeTo';
                break;
            case 'stopall':
                cmd = 'stopAll';
                break;
        }

        if (cmd === 'isPlaying' && what === 'master') {
            cmd = 'audioPlaying';
        }

        if (what === 'group') {
            if (isFn(A.group.prototype[cmd])) {
                return cmd;
            }
        } else if (what === 'master') {
            if (isFn(A[cmd])) {
                return cmd;
            }
        } else {
            if (isFn(A.classes[what].prototype[cmd])) {
                return cmd;
            }
        }
        throw new Error('Cannot run the command: "' + cmd + '" on the API "' + what + '". The command may be invalid, or this may be a bug in HAL.');
    }

    var macros = {
        // (newtrack: name, source [, source...])
        newtrack : function () {
            var args = [].slice.call(arguments);
            try {
                return A.newTrack.apply(null, args);
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
        // (masteraudio: command [, args...])
        masteraudio : function (command) {
            try {
                command = getCommand(command, 'master');
                return A[command].apply(null, [].slice.call(arguments).slice(1));
            } catch (err) {
                alert('Error in the (masteraudio:) macro: ' + err.message);
            }
        },
        // (track: name, command [, args...])
        track : function (track, command) {
            try {
                var _get = A.track(track);
                command = getCommand(command, 'Track');
                return _get[command].apply(_get, [].slice.call(arguments).slice(2));
            } catch (err) {
                alert('Error in the (track:) macro: ' + err.message);
            }
        },
        // (playlist: name, command [, args...])
        playlist : function (list, command) {
            try {
                var _get = A.playlist(list);
                command = getCommand(command, 'Playlist');
                return _get[command].apply(_get, [].slice.call(arguments).slice(2));
            } catch (err) {
                alert('Error in the (playlist:) macro: ' + err.message);
            }
        },
        // (group: name, command [, args...])
        group : function (gr, command) {
            try {
                var _get = A.group(gr);
                command = getCommand(command, 'group');
                return _get[command].apply(_get, [].slice.call(arguments).slice(2));
            } catch (err) {
                alert('Error in the (group:) macro: ' + err.message);
            }
        }
    };

    window.Chapel.Macros.add(macros);
}());