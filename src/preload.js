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
        if (_state.pastLength || _state.futureLength) {
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
                Chapel.Audio.classes.Track.get(id).$el
                    .off('canplay')
                    .one('canplay', function () {
                        _load();
                    });
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