(function () {
    'use strict';

    var $overlay = $((document).createElement('div'))
        .attr('id', 'audio-overlay')
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
        $(document).ready( function () {
            // DOM is loaded, display the overlay
            loaderShow();
        });
        var delay = 100 + options.loadDelay;
        setTimeout(function () {
            var trackList = Chapel.Audio.classes.Track.list;
            if (trackList && Array.isArray(trackList) && trackList.length) {
                var sounds = Chapel.Audio.classes.Track.list.map( function (el) {
                    return el.$el;
                });
                var track;

                var loadTrack = function () {
                    if (!sounds.length) {
                        loaderDismiss();
                        return;
                    }
                    track = sounds.shift();
                    track.attr('preload', 'auto');
                    track.one('canplay.loadTrack', function () {
                        $(this).off('.loadTrack');
                        loadTrack();
                    });
                };

                loadTrack();
            }
        }, delay);
    }
    
    if (options.preload) {
        loadSources();
    }

    // export to Chapel namespace
    window.Chapel = window.Chapel || {};
    window.Chapel.Audio = window.Chapel.Audio || {};
    window.Chapel.Audio.loadScreen = {
        show : loaderShow,
        dismiss : loaderDismiss
    };
    window.Chapel.Audio.$overlay = $overlay;
    window.Chapel.Audio.preload = loadSources;

}());