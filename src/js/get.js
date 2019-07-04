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

    // set storage key for this story with IFID + Story Title
    options.storagekey = options.storagekey + '-' + Chapel.Get.IFID + '-{' + Chapel.Get.storyTitle + '}';

    // hack the macro API
    var _macros = require('macros');
    function simpleMacro (name, cb) {
        _macros.add(name, function () {
            var arr = [].slice.call(arguments).slice(1);
            var result = cb.apply(null, arr);
            if (typeof result === 'string' || typeof result === 'boolean' || typeof result === 'number') {
                // only return numbers, booleans, and strings
                return result;
            }
            return '';
        }, _macros.TypeSignature.zeroOrMore(_macros.TypeSignature.Any));
    }

    function addMacros (obj) {
        if (!obj || typeof obj !== 'object') {
            return;
        }
        Object.keys(obj).forEach( function (macro) {
            simpleMacro(macro, obj[macro]);
        });
    }

    window.Chapel = window.Chapel || {};

    window.Chapel.Macros = {
        add : addMacros
    };
}());