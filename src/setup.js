(function () {
    'use strict';

    if (window.A === undefined) {
        window.A = window.Chapel.Audio;
    }

    $(document).on('unload', function () {
        A.savePrefs();
    });

}());