(function () {
    'use strict';

    var options = Chapel.options;

    if (options.globalA && window.A === undefined) {
        Chapel.debug('Created global A interface.');
        window.A = window.Chapel.Audio;
    }

    if (Chapel.Get.fromPassage) {
        Chapel.debug('Loading tracks from track def special passage -> ', Chapel.Get.fromPassage);
        // autoload tracks from the `hal.tracks` special passage
        Chapel.Get.fromPassage.forEach( function (sources, name) {
            Chapel.Audio.newTrack.apply(null, [name].concat(sources));
        });
    }

    $(document).on('unload', function () {
        Chapel.debug('User Prefs Saved');
        window.Chapel.Audio.savePrefs();
    });

    Chapel.Audio.classes.Track.renew();
    if (Chapel.Audio.controls) {
        Chapel.Audio.controls.updateVolume();
    }

    if (Chapel.Get.isHarlowe3OrLater) {
        $(window).on('unload', function () {
            Chapel.debug('HAL State Saved');
            // save tracks to session storage
            Chapel.Audio.state.saveTracks();
            Chapel.Audio.state.savePlaylists();
            Chapel.Audio.state.saveGroups();
        });

        // reload any tracks in session storage on start-up
        Chapel.debug('HAL State Loaded');
        Chapel.Audio.state.loadTracks();
        Chapel.Audio.state.loadPlaylists();
        Chapel.Audio.state.loadGroups();
    }

    if (options.persistPrefs) {
        Chapel.debug('User Prefs Loaded');
        Chapel.Audio.loadPrefs();
    }

}());