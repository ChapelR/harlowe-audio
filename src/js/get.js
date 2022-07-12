(function () {
    'use strict';

    // pull data from the data chunk for use elsewhere

    var $dataChunk = $('tw-storydata');

    // parsers

    var parseLn = /(.+?):(.+)/;
    var lineBreak = /[\r\n]+/;
    var openQuote = /^["']/;
    var closeQuote = /["']$/;

    function parseBlock (block) {
        return Fast.map(Fast.filter(block.split(lineBreak), function (line) { 
            return line && line.trim() && line.includes(':');
        }), function (line) { 
            return line.trim();
        });
    }

    function cleanString (str) {
        return str
            .trim()
            .replace(openQuote, '')
            .replace(closeQuote, '')
            .trim();
    }

    function parseLine (line) {
        var parsed = line.match(parseLn);
        return parsed instanceof Array ? { 
            key : cleanString(parsed[1]), 
            value : cleanString(parsed[2]) 
        } : line;
    }

    function parseSourceList (sourceList) {
        return Fast.map(sourceList.split(','), function (source) {
            return cleanString(source);
        });
    }

    // track defs (special passage method)

    var $trackPassage = $dataChunk.find('tw-passagedata[name="hal.tracks"]');

    var tracksFromPassage = null;

    if ($trackPassage.length) {
        var lines = parseBlock($trackPassage.text());

        var iterator = [];
        var errors = [];

        Fast.forEach(lines, function (line) {
            var parts = parseLine(line);
            if (typeof parts === "string") {
                errors.push(parts);
            }
            iterator.push([parts.key, parseSourceList(parts.value)]);
        });

        if (errors.length) {
            console.error("Some track definitions could not be parsed:\n" + errors.join("\n") + "\nPlease check these definitions and try again.");
        }

        tracksFromPassage = new Map(iterator);
    }

    // user configs

    var $configPassage = $dataChunk.find('tw-passagedata[name="hal.config"]');

    var configsFromPassage = null;

    if ($configPassage.length) {
        var cfgLines = parseBlock($configPassage.text());

        var userOptions = {};

        Fast.forEach(Fast.map(cfgLines, function (line) { 
            var parts = parseLine(line);

            return parts;
        }), function (pair) { 
            userOptions[pair.key] = pair.value;
        });
        configsFromPassage = userOptions;
    }

    if (configsFromPassage) {
        Fast.forEach(Object.keys(configsFromPassage), function (option) {
            var configName = option, 
                toSet = userOptions[option],
                type = typeof Chapel.options[option];
            if (type === 'boolean') {
                if (toSet === 'true') {
                    Chapel.options[configName] = true;
                } else if (toSet === 'false') {
                    Chapel.options[configName] = false;
                }
            } else if (type === 'number') {
                toSet = Number(toSet);
                if (!Number.isNaN(toSet)) {
                    Chapel.options[configName] = toSet;
                }
            } else if (type === 'string') {
                if (toSet) {
                    Chapel.options[configName] = toSet;
                }
            }
        });
    }

    function getHarloweVersion (sem) {
        var semVer = $dataChunk.attr('format-version');
        if (sem) {
            return semVer;
        }
        var arr = semVer.split('.');
        var major = arr[0];
        var minor = arr[1];
        var patch = arr[2];
        major = Number(major);
        minor = Number(minor);
        if (Number.isNaN(major)) {
            major = 3;
        }
        if (Number.isNaN(minor)) {
            minor = 3;
        }
        if (Number.isNaN(patch)) {
            patch = 0;
        }
        if (major < 1) {
            major = 3;
        }
        return [major, minor, patch];
    }

    function oldMacroAPI () {
        var version = getHarloweVersion();
        if (version[0] >= 3 && version[1] >= 3) {
            return false;
        }
        return true;
    }

    function version3OrLater () {
        return getHarloweVersion()[0] >= 3;
    }

    function getStoryTitle () {
        return $dataChunk.attr('name');
    }

    function getStoryIFID () {
        return $dataChunk.attr('ifid');
    }

    function simpleMacroRun (cb) {
        return function () {
            var arr = [].slice.call(arguments).slice(1);
            var result = cb.apply(null, arr);
            if (typeof result === 'string' || typeof result === 'boolean' || typeof result === 'number') {
                // only return numbers, booleans, and strings
                return result;
            }
            return '';
        }
    }

    // hack the macro API
    var _macros = require('macros'); // this is blocking :(
    function simpleMacro (name, cb) {
        // test for old macro API (3.2.3 and lower)
        if (oldMacroAPI()) {
            // if old
            _macros.add(name, simpleMacroRun(cb), _macros.TypeSignature.zeroOrMore(_macros.TypeSignature.Any));
        } else {
            // if new (3.3.0 and higher)
            _macros.add(name, 'Any', simpleMacroRun(cb), _macros.TypeSignature.zeroOrMore(_macros.TypeSignature.Any));
        }
    }

    function addMacros (obj) {
        if (!obj || typeof obj !== 'object') {
            return;
        }
        Fast.forEach(Object.keys(obj), function (macro) { 
            simpleMacro(macro, obj[macro]);
        });
    }

    window.Chapel = window.Chapel || {};

    window.Chapel.Macros = {
        add : addMacros
    };

    window.Chapel.Get = Object.freeze({
        version : getHarloweVersion(),
        isHarlowe3OrLater : version3OrLater(),
        storyTitle : getStoryTitle(),
        IFID : getStoryIFID(),
        useOldMacroAPI : oldMacroAPI(),
        fromPassage : tracksFromPassage
    });

    Chapel.debug('Harlowe Version -> ', Chapel.Get.version.join("."));
    Chapel.debug('Harlowe Major Version -> ', Chapel.Get.version[0]);
    Chapel.debug('Story Title -> ', Chapel.Get.storyTitle);
    Chapel.debug('Story IFID -> ', Chapel.Get.IFID);

    if (Chapel.Get.version[0] < 2) {
        throw new Error('The Harlowe Audio Library is only designed to work with Harlowe 2 and 3; you appear to be using Harlowe 1 or an otherwise invalid story format.', 'get.js -> initialization', 176);
    }

    // set storage key for this story with IFID + Story Title
    Chapel.options.storagekey = '%%hal-' + Chapel.Get.IFID + '-{' + Chapel.Get.storyTitle + '}';
    Chapel.debug('Storage Key -> ', Chapel.options.storagekey);

}());