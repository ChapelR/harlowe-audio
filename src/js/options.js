(function () {

    var options = {
        preload : true,
        loadDelay : 0,
        muteOnBlur : true,
        startingVol : 0.5,
        persistPrefs : true,
        globalA : true,
        showControls : true,
        sidebarStartClosed : true,
        volumeDisplay : true,
        trackLoadLimit : 500,
        totalLoadLimit : 8000
    };

    window.Chapel = window.Chapel || {};

    window.Chapel.options = options;

}());