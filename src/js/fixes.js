(function () {
    'use strict';

    // fix prompt injection

    function isHTML(str) {
        var doc = new DOMParser().parseFromString(str, "text/html");
        return Array.from(doc.body.childNodes).some( function (node) { return node.nodeType === 1; });
    }

    if (options.includeFixes) {
        var cached = window.prompt;

        window.prompt = function () {
            var result = cached.apply(null, [].slice.call(arguments));
            if (isHTML(result)) {
                return (result.replace(/[<>]/g, ''));
            } else {
                return result;
            }
        };
    }

}());