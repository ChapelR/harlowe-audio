(function () {
    'use strict';

    var options = Chapel.options;

    // save the state to reload it on restarts...
    // load script just before setup.js

    var _key = options.storagekey + '_hal_restart_';
    Chapel.debug('HAL Session Key -> ', _key);

    var _store = (function () {
        var save, load;
        if (window.sessionStorage) {
            Chapel.debug('Session Storage Available');
            save = function (key, data) {
                window.sessionStorage.setItem(_key + key, data);
            };
            load = function (key) {
                return window.sessionStorage.getItem(_key + key);
            };
        } else {
            Chapel.debug('Session Storage Unavailable');
            save = function () { /* no op */ };
            load = function () { /* no op */ };
            console.warn('Session storage is unavailable...');
        }
        return {
            save : save,
            load : load
        };
    }());

    // tracks

    function saveTracks () {
        var data;
        try {
            data = Chapel.Audio.classes.Track.list.map( function (track) {
                return {
                    id : track.id,
                    sources : track.sources
                };
            });
            Chapel.debug('Session Saved (Tracks) -> ', data);
            data = JSON.stringify(data);
            _store.save('tracks', data);
        } catch (err) {
            console.error(err.message);
        }
    }

    function loadTracks () {
        // reprocess all track data
        var data;
        try {
            data = _store.load('tracks');
            if (data) {
                data = JSON.parse(data);
            }
            if (Array.isArray(data) && data.length) {
                Chapel.debug('Session Loaded (Tracks) -> ', data);
                data.forEach( function (def) {
                    if (def.id && def.sources && !Chapel.Audio.classes.Track.has(def.id)) {
                        Chapel.Audio.newTrack.apply(null, [def.id].concat(def.sources));
                    } else {
                        Chapel.debug('Track reloading skipped.');
                    }
                });
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    // playlists

    function savePlaylists () {
        var data;
        try {
            var plList = Chapel.Audio.classes.Playlist.list;
            data = Object.keys(plList).map( function (pl) {
                var obj = {};
                obj.tracks = plList[pl].tracks.map( function (tr) {
                    return tr.id;
                });
                obj.id = plList[pl].id;
                return obj;
            });
            Chapel.debug('Session Saved (Playlists) -> ', data);
            data = JSON.stringify(data);
            _store.save('playlists', data);
        } catch (err) {
            console.error(err.message);
        }
    }

    function loadPlaylists () {
        var data;
        try {
            data = _store.load('playlists');
            if (data) {
                data = JSON.parse(data);
            }
            if (data && Array.isArray(data) && data.length) {
                Chapel.debug('Session Loaded (Playlists) -> ', data);
                data.forEach( function (def) {
                    if (def.id && def.tracks) {
                        Chapel.Audio.createPlaylist(def.id, def.tracks);
                    }
                });
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    // custom groups

    function saveGroups () {
        var data;
        try {
            data = {};
            Object.keys(Chapel.Audio.groups.custom).forEach( function (gr) {
                data[gr] = Chapel.Audio.groups.custom[gr].map( function (tr) {
                    if (typeof tr === 'string') {
                        return tr;
                    }
                    return tr.id;
                });
            });
            Chapel.debug('Session Saved (Groups) -> ', data);
            data = JSON.stringify(data);
            _store.save('groups', data);
        } catch (err) {
            console.error(err.message);
        }
    }

    function loadGroups () {
        var data;
        try {
            data = _store.load('groups');
            if (data) {
                data = JSON.parse(data);
            }
            if (data && typeof data === 'object') {
                Chapel.debug('Session Loaded (Groups) -> ', data);
                Object.keys(data).forEach( function (gr) {
                    data[gr].map( function (tr) {
                        return Chapel.Audio.classes.Track.get(tr);
                    });
                });
                Chapel.Audio.groups.custom = data;
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    window.Chapel.Audio.state = {
        _store : _store,
        saveTracks : saveTracks,
        loadTracks : loadTracks,
        savePlaylists : savePlaylists,
        loadPlaylists : loadPlaylists,
        saveGroups : saveGroups,
        loadGroups : loadGroups
    };

}());