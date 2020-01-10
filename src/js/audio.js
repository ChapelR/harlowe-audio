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
        throw new Error(msg, 'audio.js -> bail()', 140);
    }

    var validMaster = validEvents.track.concat(validEvents.master);

    // event parser
    function parseEvent (type, master) {
        if (!type || typeof type !== 'string' || !type.trim()) {
            return null;
        }
        var events = type.split(' ').map( function (type) {
            type = type.split('.')[0];
            if (type[0] !== ':') {
                type = ':' + type;
            }
            return type + '.userland';
        }).filter( function (type) {
            if (master) {
                return validMaster.includes(type);
            }
            return validEvents.track.includes(type);
        }).join(' ');
        if (events && events.trim()) {
            return events;
        }
        return null;
    }

    Audio.data = {
        parseEvent : parseEvent,
        bail : bail
    };

    Audio.on = function (type, cb) {
        if (!cb || typeof cb !== 'function') {
            console.error('Chapel.Audio.on() -> invalid callback');
            return;
        }
        type = parseEvent(type, true);
        if (type) {
            $(document).on(type, cb);
        }
    };
    Audio.one = function (type, cb) {
        if (!cb || typeof cb !== 'function') {
            console.error('Chapel.Audio.one() -> invalid callback');
            return;
        }
        type = parseEvent(type, true);
        if (type) {
            $(document).one(type, cb);
        }
    };

    Audio.off = function (type) {
        type = parseEvent(type, true);
        if (type) {
            $(document).off(type);
        }
    };

    if (options.persistPrefs) {
        $(document).on(':master-mute', Audio.savePrefs);
        $(document).on(':master-volume', Audio.savePrefs);
    }

    $(document).on(':play', function (ev) {
        ev.track.addToGroup('playing');
    });

    $(document).on(':stop', function (ev) {
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

    Audio.parseEvent = parseEvent;

    window.Chapel = window.Chapel || {};

    window.Chapel.Audio = Audio;
}());