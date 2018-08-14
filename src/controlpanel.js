(function () {
    'use strict';

    if (options.controls.show) {

        var $volume = $(document.createElement('input'))
            .attr({
                id : 'audio-volume',
                type : 'range',
                min : 1,
                max : 99,
                step : 1
            });

        var starting = Math.trunc(window.Chapel.Audio.master.volume * 100);
        if (starting < 0) {
            starting = 0;
        } else if (starting > 100) {
            starting = 100;
        }
        $volume.attr('value', starting);

        $volume.on('input', function () {
            window.Chapel.Audio.volume($(this).val() / 100);
        });

        var $mute = $(document.createElement('tw-link'))
            .attr('id', 'audio-mute')
            .append('Mute <span></span>')
            .on('click', function (ev) {
                ev.preventDefault();
                $(this).toggleClass('muted');
                Chapel.Audio.mute(!Chapel.Audio.isMuted());
            });

        if (Chapel.Audio.isMuted()) {
            $mute.addClass('muted');
        }

        var $toggle = $(document.createElement('tw-link'))
            .attr('id', 'audio-panel-toggle')
            .on('click', function (ev) {
                ev.preventDefault();
                $panel.toggleClass('closed');
            });

        var $panel = $(document.createElement('div'))
            .attr('id', 'audio-controls')
            .append($volume, $mute, $toggle)
            .appendTo(document.body);

        if (options.controls.startClosed) {
            $panel.addClass('closed');
        }

        // export
        window.Chapel = window.Chapel || {};
        window.Chapel.Audio = window.Chapel.Audio || {};
        window.Chapel.Audio.controls = {
            $panel : $panel,
            $volume : $volume,
            $mute : $mute,
            close : function () {
                $panel.addClass('closed');
            },
            open : function () {
                $panel.removeClass('closed');
            },
            toggle : function () {
                $panel.toggleClass('closed');
            }
        };
    }

}());