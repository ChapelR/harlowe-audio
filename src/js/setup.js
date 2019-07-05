(function () {
    'use strict';

    var options = Chapel.options;

    if (options.globalA && window.A === undefined) {
        window.A = window.Chapel.Audio;
    }

    if (Chapel.Get.fromPassage) {
        // autoload tracks from the `hal.tracks` special passage
        Chapel.Get.fromPassage.forEach( function (sources, name) {
            Chapel.Audio.newTrack.apply(null, [name].concat(sources));
        });
    }

    $(document).on('unload', function () {
        window.Chapel.Audio.savePrefs();
    });

    Chapel.Audio.classes.Track.renew();
    if (Chapel.Audio.controls) {
        Chapel.Audio.controls.updateVolume();
    }

    if (Chapel.Get.isHarlowe3OrLater) {
        $(window).on('unload', function () {
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

    if (options.persistPrefs) {
        Chapel.Audio.loadPrefs();
    }

}());