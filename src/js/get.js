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
        return block.split(lineBreak).filter( function (line) {
            return line && line.trim() && line.includes(':');
        }).map( function (line) {
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
        return { 
            key : cleanString(parsed[1]), 
            value : cleanString(parsed[2]) 
        };
    }

    function parseSourceList (sourceList) {
        return sourceList.split(',').map( function (source) {
            return cleanString(source);
        });
    }

    // track defs (special passage method)

    var $trackPassage = $dataChunk.find('tw-passagedata[name="hal.tracks"]');

    var tracksFromPassage = null;

    if ($trackPassage.length) {
        var lines = parseBlock($trackPassage.text());

        var tracks = new Map(lines.map( function (line) {
            var parts = parseLine(line);
            return [parts.key, parseSourceList(parts.value)];
        }));
        tracksFromPassage = tracks;
    }

    // user configs

    var $configPassage = $dataChunk.find('tw-passagedata[name="hal.config"]');

    var configsFromPassage = null;

    if ($configPassage.length) {
        var cfgLines = parseBlock($configPassage.text())

        var userOptions = {};

        cfgLines.map( function (line) {
            var parts = parseLine(line);

            return parts;
        }).forEach( function (pair) {
            userOptions[pair.key] = pair.value;
        });
        configsFromPassage = userOptions;
    }

    if (configsFromPassage) {
        Object.keys(configsFromPassage).forEach( function (option) {
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

    if (Chapel.Get.version < 2) {
        throw new Error('The Harlowe Audio Library is only designed to work with Harlowe 2 and 3; you appear to be using Harlowe 1 or an otherwise invalid story format.');
    }

    // set storage key for this story with IFID + Story Title
    Chapel.options.storagekey = '%%hal-' + Chapel.Get.IFID + '-{' + Chapel.Get.storyTitle + '}';

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

    window.Chapel.Get = {
        version : getHarloweVersion(),
        isHarlowe3OrLater : version3OrLater(),
        storyTitle : getStoryTitle(),
        IFID : getStoryIFID(),
        fromPassage : tracksFromPassage
    };
    
}());