(function () {
    'use strict';

    // pull data from the data chunk for use elsewhere

    var $dataChunk = $('tw-storydata');

    var $trackPassage = $dataChunk.find('tw-passagedata[name="hal.tracks"]');

    var tracksFromPassage = null;

    if ($trackPassage.length) {
        var lines = $trackPassage.text().split(/[\n\r]/).filter( function (l) {
            // ignore blank or malformed lines
            return l && l.trim() && l.includes(':');
        });
        var tracks = new Map(lines.map( function (line) {
            var parts = line.split(':');

            var trackName = parts[0].trim();
            trackName = trackName.replace(/^["']/, '');
            trackName = trackName.replace(/["']$/, '');
            trackName = trackName.trim();

            var sources = parts[1].split(',').map( function (src) {
                src = src.trim();
                src = src.replace(/^["']/, '');
                src = src.replace(/["']$/, '');
                src = src.trim();
                return src;
            });

            // TODO: test validity of trackName and sources array

            return [trackName, sources];
        }));
        console.log(tracks);
        tracksFromPassage = tracks;
    }

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
        version : getHarloweVersion(),
        isHarlowe3OrLater : version3OrLater(),
        storyTitle : getStoryTitle(),
        IFID : getStoryIFID(),
        fromPassage : tracksFromPassage
    };

    if (Chapel.Get.version < 2) {
        throw new Error('The Harlowe Audio Library is only designed to work with Harlowe 2 and 3; you appear to be using Harlowe 1 or an otherwise invalid story format.');
    }

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