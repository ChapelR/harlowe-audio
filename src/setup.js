(function () {
    'use strict';

    if (options.globalA && window.A === undefined) {
        window.A = window.Chapel.Audio;
    }

    $(document).on('unload', function () {
        window.Chapel.Audio.savePrefs();
    });

    Chapel.Audio.classes.Track.renew();

}());