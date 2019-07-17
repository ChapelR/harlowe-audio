(function (){
    'use strict';

    var A = Chapel.Audio;
    var Track = A.classes.Track;

    function createAudioGroup (groupName, trackIDs) {
        if (!trackIDs || !Array.isArray(trackIDs)) {
            trackIDs = [];
        }
        A.groups.custom[groupName] = trackIDs.map( function (id) {
            return Track.get(id);
        });
    }

    A.createGroup = function (groupName, tracks, test) {
        var ids;
        if (test) {
            ids = [].slice.call(arguments).slice(1);
        } else {
            ids = tracks;
        }
        createAudioGroup(groupName, ids);
    };

    A.group = function (name) {
        if (!(this instanceof A.group)) {
            return new A.group(name);
        }
        if (Object.keys(A.groups.custom).includes(name)) {
            this.members = A.groups.custom[name];
        } else {
            this.members = A.groups[name];
        }
        if (!Array.isArray(this.members)) {
            this.members = [];
            console.error('Could not find members for track group "' + name + '"!');
        }
    };

    Object.assign(A.group, {
        is : function (inst) {
            return (this instanceof A.group);
        },

        runOnAll : function (group, method, args) {
            group.members.forEach( function (track) {
                track[method].apply(track, (args && Array.isArray(args)) ? args : []);
            });
        },

        extend : function (data) {
            _extend(A.group, data);
        },

        extendPrototype : function (data) {
            _extend(A.group.prototype, data);
        }
    });

    // A.group('playing').pause(); or A.group('playing').mute(true);

    Object.assign(A.group.prototype, {
        constructor : A.group,
        run : function (method, args, test) {
            if (test != null) {
                args = [].slice.call(arguments).slice(1);
            }
            if (Track.prototype.hasOwnProperty(method)) {
                A.group.runOnAll(this, method, args);
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
    });

    A.extendGroup = A.group.extend;
    A.extendGroupProto = A.group.extendPrototype;
}());