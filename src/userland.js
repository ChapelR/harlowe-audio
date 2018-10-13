(function () {
    'use strict';

    var _engine = Engine;

    // userland sidebar editing
    var $user = Chapel.Audio.controls.$user;

    function checkDisp () {
        // return true if user sidebar is displayed
        return $user.css('display') !== 'none';
    }

    function showUserMenu () {
        if (!checkDisp()) {
            $user.css('display', 'block');
        }
    }

    function hideUserMenu () {
        if (checkDisp()) {
            $user.css('display', 'none');
        }
    }

    function addLinks (text, psg, cb) {
        // add tw-link elements to the userland sidebar area
        if (!cb && typeof psg === 'function') {
            cb = psg;
            psg = null;
        }
        if (!psg || typeof psg !== 'string') {
            psg = null;
        }
        if (!cb || typeof cb !== 'function') {
            cb = null;
        }
        if (!text || typeof text !== 'string') {
            return;
        }
        var $link = $(document.createElement('tw-link'))
            .append(text)
            .attr('tabindex', '0')
            .on('click', function () {
                if (psg) {
                    _engine.goToPassage(psg);
                }
                if (cb) {
                    cb();
                }
            })
            .addClass('story-menu')
            .appendTo($user);

        showUserMenu();
    }

    Chapel.Audio.sidebar = { add : addLinks };

}());