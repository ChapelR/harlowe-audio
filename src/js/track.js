(function () {
    'use strict';

    var A = Chapel.Audio;
    var parseEvent = A.data.pareEvent;
    var bail = A.data.bail;
    var options = Chapel.options;

    var $container = $(document.createElement('div'))
        .attr('id', 'audio-container')
        .css('display', 'none')
        .appendTo(document.body);

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
        }).one('canplaythrough.hal', function () {
            A.loaded.push(id);
        });

        if (options.preload) {
            $audio.attr('preload', 'auto');
        }

        // set starting volume
        $audio[0].volume = 1 * A.master.volume;

        this.id = id;
        this.$el = $audio;
        this.unwrap = $audio[0];
        this.sources = sources;
    }

    Object.assign(Track, {
        list : [],

        is : function (inst) {
            return (inst instanceof Track);
        },

        has : function (id) {
            return Track.list.some( function (track) {
                return track.id === id;
            });
        },

        emit : function (type, track) {
            $(document).trigger({
                type : type,
                track : track
            });
            track.emit(type);
        },

        add : function (id, sources, test) {
            if (test) {
                sources = [].slice.call(arguments).slice(1);
            }
            var track = new Track(id, sources);
            Track.list.push(track);
            track.$el.on('canplay', function () {
                Track.emit(':available', track);
            });
            track.$el.on('canplaythrough', function () {
                Track.emit(':loaded', track);
            });
            track.attach();
            return track;
        },

        renew : function () {
            Track.list.forEach( function (track) {
                track.mute(track.isMuted());
                track.volume(track.getVolume());
            });
        },

        getIdx : function (id) {
            return Track.list.findIndex( function (track) {
                return track.id === id;
            });
        },

        get : function (id) {
            return Track.list.find( function (track) {
                return track.id === id;
            });
        },
        removeFromDOM : function (track) {
            if (typeof track === 'string') {
                track = Track.get(track);
            }
            if (track && Track.is(track)) {
                track.unattach();
            } else {
                $container.remove();
            }
        }
    });

    Object.assign(Track.prototype, {
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
        isAttached : function () {
            return $.contains($container[0], this.unwrap);
        },
        attach : function () {
            if (!this.isAttached()) {
                this.$el.appendTo($container);
            }
            return this;
        },
        unattach : function () { 
            if (this.isAttached()) {
                this.$el.remove();
            }
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
            this.$el.attr('data-mute', bool);
            if (A.master.mute) {
                this.unwrap.muted = true;
            } else {
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
                this.unwrap.volume = val * A.master.volume;
            }
            Track.emit(':volume', this);
            return this;
        },
        getVolume : function () {
            return Number(this.$el.attr('data-volume'));
        },
        addToGroup : function (group, custom) {
            var self = this;
            var gr = custom ? A.groups.custom[group] : A.groups[group];
            if (!gr.some( function (tr) {
                return self.id === tr.id;
            })) {
                gr.push(this);
            }
            return this;
        },
        removeFromGroup : function (group, custom) {
            var self = this;
            var gr = custom ? A.groups.custom[group] : A.groups[group];
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
            this.$el.animate({ volume: target * A.master.volume }, duration * 1000, function () {
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
            var self = this;
            duration = duration || 1;
            level = Number(level);
            if (!Number.isNaN(level)) {
                if (level > 1) {
                    level = 1;
                } else if (level < 0) {
                    level = 0;
                }
            } else {
                alert('ivalid volume level');
                return;
            }
            this.$el.animate({ volume: level * A.master.volume }, duration * 1000, function () {
                self.volume(level);
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
        },
        on : function (type, cb) {
            if (!cb || typeof cb !== 'function') {
                console.error('<track>.on() -> invalid callback');
                return this;
            }
            type = parseEvent(type);
            if (type) {
                this.$el.on(type, cb);
            }
        },
        one : function (type, cb) {
            if (!cb || typeof cb !== 'function') {
                console.error('<track>.one() -> invalid callback');
                return this;
            }
            type = parseEvent(type);
            if (type) {
                this.$el.one(type, cb);
            }
        },
        off : function (type) {
            type = parseEvent(type);
            if (type) {
                this.$el.off(type);
            }
        }
    });

    A.classes.Track = Track;
    A.newTrack = function () {
        try {
            return Track.add.apply(null, arguments);
        } catch (err) {
            console.error(err.message);
            alert('Error in A.newTrack() -> see the console for more information.');
        }
    };
    A.track = function (id) {
        try {
            return Track.get(id);
        } catch (err) {
            console.error(err.message);
            alert('Error in A.track() -> see the console for more information.');
        }
    };

    $(document).on(':master-mute', Track.renew);
    $(document).on(':master-volume', Track.renew);
}());