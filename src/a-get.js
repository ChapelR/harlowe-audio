(function () {
    'use strict';

    // pull data from the data chunk for use elsewhere

    var $dataChunk = $('tw-storydata');

    function getHarloweVersion () {
        var semVer = $dataChunk.attr('format-version');
        var major = semVer.split('.')[0];
        major = Number(major);
        if (Number.isNaN(major)) {
            major = 3;
        }
        if (major < 1) {
            major = 3;
        }
        return major;
    }

    function version3OrLater () {
        return getHarloweVersion() >= 3;
    }

    function getStoryTitle () {
        return $dataChunk.attr('name');
    }

    function getStoryIFID () {
        return $dataChunk.attr('ifid');
    }

    window.Chapel = window.Chapel || {};

    window.Chapel.Get = {
        isHarlowe3OrLater : version3OrLater(),
        storyTitle : getStoryTitle(),
        IFID : getStoryIFID()
    };
}());