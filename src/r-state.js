(function () {
    'use strict';

    // save the state to reload it on restarts...
    // load script just before setup.js

    var _key = options.storagekey + '_hal_restart_';
    var _store = function () {
        if (window.sessionStorage) {
            save = function (key, data) {
                window.sessionStorage.setItem(_key + 'key', data);
            };
            load = function (key) {
                return window.sessionStorage.getItem(_key + 'key');
            };
        } else {
            save = function () { /* no op */ };
            load = function () { /* no op */ };
            console.warn('Session storage is unavailable...');
        }
        return {
            save : save,
            load : load
        };
    };

    function saveTracks () {
        var data;
        try {
            data = Chapel.Audio.classes.Track.list.map( function (track) {
                return {
                    id : track.id,
                    sources : track.sources
                };
            });
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
                data.forEach( function (def) {
                    if (def.id && def.sources && !Chapel.Audio.classes.Track.has(def.id)) {
                        Chapel.Audio.newTrack(def.id, def.sources);
                    } else {
                        console.warn('Track reload failed...');
                    }
                });
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    window.Chapel.Audio.state = {
        _store : _store,
        saveTracks : saveTracks,
        loadTracks : loadTracks
    };

}());