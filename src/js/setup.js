(function () {
    'use strict';

    if (options.globalA && window.A === undefined) {
        window.A = window.Chapel.Audio;
    }

    $(document).on('unload', function () {
        window.Chapel.Audio.savePrefs();
    });

    Chapel.Audio.classes.Track.renew();
    if (Chapel.Audio.controls) {
        Chapel.Audio.controls.updateVolume();
    }

    if (Chapel.Get.isHarlowe3OrLater) {
        $(document).one('unload', function () {
            // save tracks to session storage
            Chapel.Audio.state.saveTracks();
            Chapel.Audio.state.savePlaylists();
            Chapel.Audio.state.saveGroups();
        });

        // reload any tracks in session storage on start-up
        Chapel.Audio.state.loadTracks();
        Chapel.Audio.state.loadPlaylists();
        Chapel.Audio.state.loadGroups();
    }

}());