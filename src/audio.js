(function () {
    'use strict';

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
            Track.list.forEach( function (tr) {
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

    /** 
      * stolen from sugarCube's simpleaudio.js, by Thomas Michael Edwards
      * https://bitbucket.org/tmedwards/sugarcube/src/ab043c3d6dcdc69c208285272e4632c376f7e80d/src/lib/simpleaudio.js
     **/
    var formatMap = {
        aac : 'audio/aac',
        caf     : 'audio/x-caf',
        'x-caf' : 'audio/x-caf',
        mp3  : 'audio/mpeg; codecs="mp3"',
        mpeg : 'audio/mpeg; codecs="mp3"',
        m4a     : 'audio/mp4',
        mp4     : 'audio/mp4',
        'x-m4a' : 'audio/mp4',
        'x-mp4' : 'audio/mp4',
        oga : 'audio/ogg',
        ogg : 'audio/ogg',
        opus : 'audio/ogg; codecs="opus"',
        wav  : 'audio/wav',
        wave : 'audio/wav',
        weba : 'audio/webm',
        webm : 'audio/webm'
    };
    // error handler
    function bail (msg) {
        throw new Error(msg);
    }
    // track class
    function Track (id, sources, test) {
        // errors
        if (!(this instanceof Track)) {
            bail('Track: called without `new` operator');
        }
        if (!id) {
            bail('Track: no id specified');
        }
        if (typeof id !== 'string') {
            bail('Track: track id is not a string');
        }
        if (!sources || (Array.isArray(sources) && !sources.length)) {
            bail('Track: no sources specified');
        }
        if (test) {
            sources = [].slice.call(arguments).slice(1);
        }
        // source mapper
        function mapSources (url) {
            var urlParts = url.split('.'),
                end = urlParts[urlParts.length - 1];

            if (end.includes('?')) {
                // trim any query strings, like `?dl=1`
                end = end.split('?')[0];
            }
            end = end.toLowerCase().trim();
            if (!Object.keys(formatMap).includes(end)) {
                bail('Track: unsupported file type "' + end + '"');
            }
            return formatMap[end];
        }
        // create it
        var $audio = $(document.createElement('audio'));
        sources.forEach( function (src) {
            $(document.createElement('source'))
                .attr({
                    src : src,
                    type : mapSources(src)
                })
                .appendTo($audio);
        });

        // finalize the element
        $audio.attr({
            'data-track' : 'id',
            'data-volume' : 1,
            'data-mute' : false
        }).one('canplay', function () {
            Audio.loaded.push(id);
        });

        if (options.preload) {
            $audio.attr('preload', 'auto');
        }

        // set starting volume
        $audio[0].volume = 1 * Audio.master.volume;

        this.id = id;
        this.$el = $audio;
        this.unwrap = $audio[0];
        this.sources = sources;
    }

    Track.list = [];

    Track.is = function (inst) {
        return (this instanceof Track);
    };

    Track.has = function (id) {
        return Track.list.some( function (track) {
            return track.id === id;
        });
    };

    Track.emit = function (type, track) {
        $(document).trigger({
            type : type,
            track : track
        });
        track.emit(type);
    };

    Track.add = function (id) {
        var sources = [].slice.call(arguments).slice(1);
        var track = new Track(id, sources);
        Track.list.push(track);
        track.$el.on('canplay', function () {
            Track.emit(':available', track);
        });
        track.$el.on('canplaythrough', function () {
            Track.emit(':loaded', track);
        });
        return track;
    };

    Track.renew = function () {
        Track.list.forEach( function (track) {
            track.mute(track.isMuted());
            track.volume(track.getVolume());
        });
    };

    Track.getIdx = function (id) {
        return Track.list.findIndex( function (track) {
            return track.id === id;
        });
    };

    Track.get = function (id) {
        return Track.list.find( function (track) {
            return track.id === id;
        });
    };

    Track.prototype = {
        constructor : Track,
        emit : function (type) {
            this.$el.trigger({
                type : type,
                track : this
            });
        },
        clone : function () { 
            return new Track(this.id, this.sources); 
        },
        attach : function () { 
            this.$audio.appendTo(document.body); 
            return this;
        },
        unattach : function () { 
            this.$audio.remove(); 
            return this;
        },
        isPlaying : function () {
            return !this.unwrap.paused;
        },
        play : function () {
            var self = this;
            this.unwrap.play();
            Track.emit(':play', this);
            this.$el.on('ended', function () {
                if (!self.unwrap.loop) {
                    self.unwrap.currentTime = 0;
                    Track.emit(':stop', self);
                }
            });
            return this;
        },
        playWhenPossible : function () {
            var self = this;
            this.unwrap.play().then(function () {
                Track.emit(':play', self);
                self.$el.on('ended', function () {
                    if (!self.unwrap.loop) {
                        self.unwrap.currentTime = 0;
                        Track.emit(':stop', self);
                    }
                });
            }, function (err) {
                $(document).one('click mousedown keydown touchstart', function () {
                    self.play();
                });
            }).catch( function (err) {
                console.error(err);
            });
            return this;
        },
        forcePlay : function () {
            var self = this;
            var $fake = $(document.createElement('a'))
                .css('display', 'none')
                .appendTo(document.body)
                .on('click', function () {
                    self.play();
                });
            setTimeout( function () {
                $fake.trigger('click');
            }, safeAudioStart);
        },
        pause : function () {
            this.unwrap.pause();
            Track.emit(':pause', this);
            return this;
        },
        stop : function () {
            this.unwrap.pause();
            this.unwrap.currentTime = 0;
            Track.emit(':stop', this);
            return this;
        },
        mute : function (bool) {
            bool = !!bool;
            if (Audio.master.mute !== bool) {
                this.$el.attr('data-mute', bool);
                this.unwrap.muted = !!Audio.master.mute;
            } else {
                this.$el.attr('data-mute', bool);
                this.unwrap.muted = bool;
            }
            Track.emit(':mute', this);
            return this;
        },
        isMuted : function () {
            var muted = this.$el.attr('data-mute');
            if (typeof muted === 'boolean') {
                return muted;
            } else {
                if (muted === 'false') {
                    return false;
                }
                return true;
            }
        },
        toggleMute : function () {
            this.mute(!this.isMuted());
            return this;
        },
        volume : function (val) {
            val = Number(val);
            if (!Number.isNaN(val)) {
                if (val > 1) {
                    val = 1;
                } else if (val < 0) {
                    val = 0;
                }
                this.$el.attr('data-volume', val);
                this.unwrap.volume = val * Audio.master.volume;
            }
            Track.emit(':volume', this);
            return this;
        },
        getVolume : function () {
            return Number(this.$el.attr('data-volume'));
        },
        addToGroup : function (group, custom) {
            var gr = custom ? Audio.groups.custom[group] : Audio.groups[group];
            gr.push(this);
            return this;
        },
        removeFromGroup : function (group, custom) {
            var self = this;
            var gr = custom ? Audio.groups.custom[group] : Audio.groups[group];
            var idx = gr.findIndex( function (track) {
                return track.id && track.id === self.id;
            });
            gr.splice(idx, 1);
            return this;
        },
        loop : function (bool) {
            this.unwrap.loop = !!bool;
            if (this.unwrap.loop) {
                this.addToGroup('looping');
            } else {
                this.removeFromGroup('looping');
            }
            return this;
        },
        isLooping : function () {
            return !!this.unwrap.loop;
        },
        toggleLoop : function () {
            this.loop(!this.isLooping());
            return this;
        },
        seek : function (time) {
            if (time < 0) {
                time = this.unwrap.duration - time;
            } else if (time > this.unwrap.duration) {
                time = this.unwrap.duration;
            }
            this.unwrap.currentTime = time;
            return this;
        },
        fadeIn : function (duration) {
            var self = this;
            duration = duration || 1;
            var target = this.getVolume();
            this.volume(0);
            this.play();
            this.$el.animate({ volume: target * Audio.master.volume }, duration * 1000, function () {
                self.volume(target);
                Track.emit(':volume', self);
                Track.emit(':fade', self);
            });
            return this;
        },
        fadeOut : function (duration) {
            duration = duration || 1;
            var self = this;
            var vol = this.getVolume();
            this.$el.animate({ volume: 0 }, duration * 1000, function () {
                self.stop();
                self.volume(vol);
                Track.emit(':volume', self);
                Track.emit(':fade', self);
            });
            return this;
        },
        fadeTo : function (duration, level) {
            duration = duration || 1;
            var vol = this.getVolume();
            level = Number(level);
            if (!Number.isNaN(level)) {
                if (level > 1) {
                    level = 1;
                } else if (level < 0) {
                    level = 0;
                }
            }
            this.volume(0);
            this.$el.animate({ volume: target * Audio.master.volume }, duration * 1000, function () {
                Track.emit(':volume', self);
                Track.emit(':fade', self);
            });
            return this;
        },
        delay : function (duration, cb) {
            var self = this;
            if (typeof cb !== 'function') {
                return; // do nothing
            }
            duration = Number(duration);
            if (Number.isNaN(duration) || duration < 0) {
                duration = 0;
            }
            setTimeout( function () {
                cb.call(self, self, duration);
            }, duration);
        }
    };

    $(document).on(':master-mute', Track.renew);
    $(document).on(':master-volume', Track.renew);

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

    Audio.classes.Track = Track;
    Audio.newTrack = Track.add;
    Audio.track = function (id) {
        return Track.get(id);
    };

    function createAudioGroup (groupName, trackIDs) {
        if (!trackIDs || !Array.isArray(trackIDs)) {
            trackIDs = [];
        }
        Audio.groups.custom[groupName] = trackIDs.map( function (id) {
            return Track.get(id);
        });
    }

    Audio.createGroup = function (groupName, tracks, test) {
        var ids;
        if (test) {
            ids = [].slice.call(arguments).slice(1);
        } else {
            ids = tracks;
        }
        createAudioGroup(groupName, ids);
    };

    Audio.group = function (name) {
        if (!(this instanceof Audio.group)) {
            return new Audio.group(name);
        }
        if (Object.keys(Audio.groups.custom).includes(name)) {
            Object.assign(this, Audio.groups.custom[name]);
        } else {
            Object.assign(this, Audio.groups[name] || null);
        }
    };

    Audio.group.is = function (inst) {
        return this instanceof Audio.group;
    };

    Audio.group.runOnAll = function (group, method, args) {
        if (Audio.group.is(group)) {
            group.forEach( function (track) {
                if (Track.is(track)) {
                    track[method].call(track, 
                        (args && Array.isArray(args)) ? args : []);
                }
            });
        }
    };

    // Audio.group('playing').pause(); or Audio.group('playing').mute(true);

    Audio.group.prototype = {
        constructor : Audio.group,
        run : function (method, args, test) {
            if (test != null) {
                args = [].slice.call(arguments).slice(1);
            }
            if (Track.prototype.hasOwnProperty(method)) {
                Audio.group.runOnAll(this, method, args);
            }
        },
        play : function () {
            this.run('play');
            return this;
        },
        pause : function () {
            this.run('pause');
            return this;
        },
        stop : function () {
            this.run('stop');
            return this;
        },
        mute : function (bool) {
            this.run('mute', [bool]);
            return this;
        },
        volume : function (val) {
            this.run('volume', [val]);
            return this;
        },
        loop : function (bool) {
            this.run('loop', [bool]);
            return this;
        }
    };

    function Playlist (id, trackIDs) {
        if (!(this instanceof Playlist)) {
            return new Playlist(id, trackIDs);
        }
        this.id = id;
        this.tracks = trackIDs.map( function (id) {
            return Track.get(id);
        });
        this.looping = false;
        this.current = '';
        this.playing = false;
    }

    Playlist.list = {};

    Playlist.is = function (inst) {
        return inst instanceof Playlist;
    };

    Playlist.add = function (id, trackList, test) {
        if (test) {
            trackList = [].slice.call(arguments).slice(1);
        }
        Playlist.list[id] = new Playlist(id, trackList);
        return Playlist.list[id];
    };

    Playlist.prototype = {
        constructor : Playlist,
        clone : function () { 
            return new Playlist(this.id, this.tracks.map( function (tr) { return tr.id; }));
        },
        shuffle : function () {
            var a = this.tracks;
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            this.tracks = a;
            return this;
        },
        random : function () {
            return this.tracks[Math.floor(Math.random() * this.tracks.length)];
        },
        isPlaying : function () {
            return this.playing;
        },
        play : function (i) {
            var self = this;
            i = i || (function () {
                if (self.current) {
                    return self.tracks.findIndex( function (tr) {
                        return tr.id === self.current;
                    });
                } else {
                    return 0;
                }
            }());

            if (i >= self.tracks.length && self.looping) {
                i = 0;
            } else if (i >= self.tracks.length) {
                self.current = '';
                self.playing = false;
                return;
            }

            var track = self.tracks[i];
            console.log(track.id, track);
            var cached = track.isLooping();
            track.loop(false);

            track.play();
            self.playing = true;
            setTimeout( function () {
                if (!track.isPlaying()) {
                    self.playing = false;
                }
            }, 20);
            self.current = track.id;

            track.$el.one('ended.playlist', function () {
                i++;
                track.loop(cached);
                self.play(i);
            });

            return self;
        },
        loop : function (bool) {
            this.looping = !!bool;
            return this;
        },
        stop : function () {
            var track = Track.get(this.current);
            track.stop();
            track.$el.off('.playlist');
            this.current = '';
            this.playing = false;
            return this;
        },
        pause : function () {
            Track.get(this.current).pause();
            this.playing = false;
            return this;
        }
    };

    // Audio.playlist('myplaylist').play(); or Audio.playlist('myplaylist').loop(true);

    Audio.classes.Playlist = Playlist;
    Audio.createPlaylist = Playlist.add;
    Audio.playlist = function (id) {
        return Playlist.list[id] || null;
    };

    window.Chapel = window.Chapel || {};

    window.Chapel.Audio = Audio;

    if (options.persistPrefs) {
        Audio.loadPrefs();
    }

}());