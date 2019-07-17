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
        totalLoadLimit : 8000,
        debug : false
    };

    window.Chapel = window.Chapel || {};

    window.Chapel.options = options;

    window.Chapel.debug = function () {
        if (!Chapel.options.debug) {
            return;
        }
        console.log.apply(null, arguments);
    };

}());