(function () {
    'use strict';

    var options = Chapel.options;

    var state = {
        save : function (key, data) {
            // save user prefs
            if (window.localStorage) {
                try {
                    key = '' + key;
                    if (typeof data !== 'string') {
                        data = JSON.stringify(data);
                    }
                    window.localStorage.setItem(key, data);
                } catch (err) {
                    console.error(err);
                }
            }
        },
        load : function (key) {
            if (window.localStorage) {
                try {
                    key = '' + key;
                    return window.localStorage.getItem(key);
                } catch (err) {
                    console.error(err);
                }
            }
        },
        clear : function (key) {
            if (window.localStorage) {
                try {
                    key = '' + key;
                    window.localStorage.removeItem(key);
                } catch (err) {
                    console.error(err);
                }
            }
        }
    };

    var safeAudioStart = 100;

    function _extend (obj, newStuff) {
        if (typeof obj !== 'object' || typeof newStuff !== 'object') {
            throw new Error('Invalid extension.');
        }
        Object.keys(newStuff).forEach( function (key) {
            if (obj[key] !== undefined) {
                throw new Error('Invalid extension: cannot clobber existing property "' + key + '"');
            }
            obj[key] = newStuff[key];
        });
    }

    var Audio = {
        // no API
        loaded : [],
        // no API
        classes : {},
        // no API
        master : {
            volume : options.startingVol,
            mute : false
        },
        // no API
        groups : {
            playing : [],
            looping : [],
            custom : {}
        },
        // master mute
        mute : function (bool) {
            Audio.master.mute = !!bool;
            $(document).trigger({
                type : ':master-mute',
                mute : !!bool
            });
        },
        isMuted : function () {
            return !!Audio.master.mute;
        },
        // master volume
        volume : function (val) {
            val = Number(val);
            if (!Number.isNaN(val)) {
                if (val > 1) {
                    val = 1;
                } else if (val < 0) {
                    val = 0;
                }
                Audio.master.volume = val;
            }
            $(document).trigger({
                type : ':master-volume',
                volume : val
            });
        },
        getVolume : function () {
            return Audio.master.volume;
        },
        // kill all audio
        stopAll : function () {
            if (!Audio.classes.Track) {
                return;
            }
            Audio.classes.Track.list.forEach( function (tr) {
                tr.stop();
            });
        },
        // anything is playing
        audioPlaying : function () {
            return !!Audio.groups.playing.length;
        },
        savePrefs : function () {
            state.save(options.storagekey, Audio.master);
        },
        loadPrefs : function () {
            var masterState = state.load(options.storagekey);
            if (masterState && typeof masterState === 'object') {
                if (masterState.hasOwnProperty('volume') && 
                    typeof masterState.volume === 'number' &&
                    masterState.hasOwnProperty('mute') && 
                    typeof masterState.volume === 'boolean') {

                    delete Audio.master;
                    Audio.master = masterState;
                }
            }
        },
        clearPrefs : function () {
            state.clear(options.storagekey);
        }
    };

    var validEvents = {
        track : [
            ':available', 
            ':loaded', 
            ':play',
            ':stop',
            ':mute',
            ':volume'
        ],
        master : [
            ':master-mute',
            ':master-volume'
        ]
    };
    // error handler
    function bail (msg) {
        throw new Error(msg);
    }

    var validMaster = validEvents.track.concat(validEvents.master);

    Audio.data = {
        validEvents : validEvents,
        bail : bail
    }

    Audio.on = function (type, cb) {
        if (!cb || typeof cb !== 'function') {
            console.error('Chapel.Audio.on() -> invalid callback');
            return;
        }
        type = type.trim().toLowerCase();
        if (type[0] !== ':') {
            type = ':' + type;
        }
        if (!validMaster.includes(type)) {
            console.error('Chapel.Audio.on() -> invalid event type');
            return;
        }
        $(document).on(type, cb);
    };
    Audio.one = function (type, cb) {
        if (!cb || typeof cb !== 'function') {
            console.error('Chapel.Audio.one() -> invalid callback');
            return;
        }
        type = type.trim().toLowerCase();
        if (type[0] !== ':') {
            type = ':' + type;
        }
        if (!validMaster.includes(type)) {
            console.error('Chapel.Audio.one() -> invalid event type');
            return;
        }
        $(document).one(type, cb);
    };

    if (options.persistPrefs) {
        Audio.on(':master-mute', Audio.savePrefs);
        Audio.on(':master-volume', Audio.savePrefs);
    }

    Audio.on(':play', function (ev) {
        ev.track.addToGroup('playing');
    });

    Audio.on(':stop', function (ev) {
        ev.track.removeFromGroup('playing');
    });

    if (options.muteOnBlur) {
        $(window).on('blur', function () {
            if (!Audio.isMuted()) {
                Audio.mute(true);
                $(window).one('focus', function () {
                    Audio.mute(false);
                });
            }
        });
    }

    // extensions
    Audio.extend = function (data) {
        _extend(Audio, data);
    };

    window.Chapel = window.Chapel || {};

    window.Chapel.Audio = Audio;

}());