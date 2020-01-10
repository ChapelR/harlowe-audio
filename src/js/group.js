(function (){
    'use strict';

    var A = Chapel.Audio;
    var Track = A.classes.Track;
    var _extend = A.data._extend;

    var playlistHeader = /(play)?list:(.+)/i;

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
            if (!A.groups[name] || !(A.groups[name] instanceof Array)) {
                throw new ReferenceError('There is no group with the id "' + id + '". Please check your spelling and capitalization.', 'group.js -> A.group()', 29);
            }
            this.members = A.groups[name];
        }
        if (playlistHeader.test(name)) {
            var listId = name.match(playlistHeader)[2];
            if (listId && listId.trim()) {
                // construct from playlist
                this.members = A.playlist(listId).tracks;
            }
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

        _runOnAll : function (group, method, args, test) {
            if (test != null) {
                args = [].slice.call(arguments).slice(2);
            } else {
                if (!(args instanceof Array)) {
                    args = [args];
                }
            }
            var pass = [group.members, method, args];
            Track._runOnMultiple.apply(null, pass);
        }
    });

    // A.group('playing').pause(); or A.group('playing').mute(true);

    Object.assign(A.group.prototype, {
        constructor : A.group,
        _run : function () {
            A.group._runOnAll.apply(null, [this].concat([].slice.call(arguments)));
        },
        play : function () {
            this._run('play');
            return this;
        },
        pause : function () {
            this._run('pause');
            return this;
        },
        stop : function () {
            this._run('stop');
            return this;
        },
        mute : function (bool) {
            this._run('mute', bool);
            return this;
        },
        volume : function (val) {
            this._run('volume', val);
            return this;
        },
        loop : function (bool) {
            this._run('loop', bool);
            return this;
        }
    });
}());