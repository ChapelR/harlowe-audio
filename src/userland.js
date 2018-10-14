(function () {
    'use strict';

    // userland sidebar editing

    var _engine = Engine;

    var $user = Chapel.Audio.controls.$user;

    function checkDisp () {
        // return true if user sidebar is displayed
        return $user.css('display') !== 'none';
    }

    function showUserMenu () {
        if (!checkDisp()) {
            $user.css('display', 'block');
        }
        return $user;
    }

    function hideUserMenu () {
        if (checkDisp()) {
            $user.css('display', 'none');
        }
        return $user;
    }

    function addLinks (text, psg, cb) {
        // add tw-link elements to the userland sidebar area
        var passage, callback;

        if (!text || typeof text !== 'string') {
            var msg = 'Cannot add a link with the text "' + (text === undefined) ? 'undefined' : JSON.stringify(text) + '".';
            alert(msg);
            console.error(msg);
            return;
        }

        if (!cb && typeof psg === 'function') {
            callback = psg;
            passage = null;
        } else {
            if (psg && typeof psg === 'string') {
                passage = psg;
            }
            if (cb && typeof cb === 'function') {
                callback = cb;
            }
        }

        var $link = $(document.createElement('tw-link'))
            .append(text)
            .attr({ 
                tabindex : '0',
                name : text.toLowerCase().trim()
            })
            .on('click', function () {
                if (passage) {
                    _engine.goToPassage(passage);
                }
                if (callback) {
                    callback();
                }
            })
            .addClass('story-menu')
            .appendTo($user);

        showUserMenu();

        return $link;
    }

    function clearLinks () {
        $user.empty();
        return hideUserMenu();
    }

    function hideLink (text) {
        text = text.toLowerCase().trim();
        $('tw-link.story-menu[name="' + text + '"]').addClass('hide');
    }

    function showLink (text) {
        text = text.toLowerCase().trim();
        $('tw-link.story-menu[name="' + text + '"]').removeClass('hide');
    }

    function toggleLink (text) {
        text = text.toLowerCase().trim();
        $('tw-link.story-menu[name="' + text + '"]').toggleClass('hide');
    }

    function deleteLink (text) {
        text = text.toLowerCase().trim();
        $('tw-link.story-menu[name="' + text + '"]').remove();
    }

    Chapel.Audio.menu = {
        hide : hideUserMenu,
        show : showUserMenu,
        isShown : checkDisp,
        links : {
            add : addLinks,
            clear : clearLinks,
            hide : hideLink,
            show : showLink,
            toggle : toggleLink,
            remove : deleteLink
        }
    };

}());