(function () {
    'use strict';

    var _state = State;

    var $overlay = $((document).createElement('div'))
        .attr('id', 'audio-overlay')
        .css('display', 'none')
        .appendTo(document.body);

    function loaderShow () {
        $overlay
            .css('display', 'block')
            .append('<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
    }

    function loaderDismiss () {
        $overlay.fadeOut( function () {
            $overlay.empty();
        });
    }

    function loadSources () { 
        if (_state.pastLength || _state.futureLength || $.browser.mobile) {
            // do not re-preload
            return;
        }
        $(document).ready( function () {
            // DOM is loaded, display the overlay
            loaderShow();
        });

        var delay = 100 + options.loadDelay;
        var trackList = Chapel.Audio.classes.Track.list;
        var loaded = Chapel.Audio.loaded;

        if (!trackList.length) {
            setTimeout(loaderDismiss, delay);
            return;
        }
        var ids = trackList.map( function (tr) {
            return tr.id;
        });

        if (options.forceDismiss) {
            /**
              *  Dismiss loading screen once tolerance for waiting is expired.
              *  This will ensure that unreliable connections, like on mobile data,
              *  aren't stuck in a perpetual load cycle if audio fails to load.
              *  Games that require audio to be playable may set the `options.forceDismiss`
              *  config to 0 or false/falsy to make the game fail to load.
             **/
            setTimeout( function () {
                loaderDismiss();
            }, options.loadLimit.total);
        }

        function _load () {

            if (!ids.length) {
                setTimeout(loaderDismiss, delay);
                return;
            }

            var id = ids.shift();

            if (loaded.includes(id)) {
                // already done
                _load();
            } else {
                // check the ready state to avoid unfortunate weirdness
                var track = Chapel.Audio.classes.Track.get(id);
                if (track.unwrap.readyState < 2) {

                    var _done = false;

                    track.$el.one('canplay', function () {
                        _load();
                        _done = true;
                    });

                    setTimeout( function () {
                        if (_done) {
                            return;
                        }
                        track.$el.off('canplay');
                        _load();
                    }, options.loadLimit.track);

                } else {

                    if (!loaded.includes(id)) {
                        // make sure the loaded list is accurate for debug purposes.
                        loaded.push(id);
                    }

                    _load();
                }
            }
        }

        _load();
    }

    // export to Chapel namespace
    window.Chapel = window.Chapel || {};
    window.Chapel.Audio = window.Chapel.Audio || {};
    window.Chapel.Audio.loadScreen = {
        show : loaderShow,
        dismiss : loaderDismiss,
        kill : function () {
            $('#audio-overlay').remove();
        }
    };
    window.Chapel.Audio.$overlay = $overlay;
    window.Chapel.Audio.preload = loadSources;

}());