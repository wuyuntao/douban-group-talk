// ==UserScript==
// @name           Douban Talk
// @namespace      http://blog.luliban.com
// @include        http://www.douban.com/group/
// ==/UserScript==

// Set jquery
var $ = jQuery = unsafeWindow.jQuery;

// Main entry
$(function() {

    if (inPopup()) {
        $('body').popupStyle();
    } else {
        topic.click(function() {
            talk.popup('toggle');
        });
    }

});

// Check if page is in popup
function inPopup() {
    return location.href.match(/#douban\-talk\-popup/);
}

// Popup window
$.fn.popup = function(action, options) {
    // Shift arguments if action is ommited
    if (typeof options == 'undefined') {
        options = action;
        action = 'init';
    }

    // Set options
    options = $.extend({
        url: location.href
    }, options || {});

    // Work by action
    switch(action) {
        case 'open': open(); break;
        case 'close': close(); break;
        case 'toggle': toggle(); break;
        case 'init':
        default: init(); break;
    }

    // Elements
    var popup = this;
    var iframe = this.children('iframe');

    function init() {
    }

    function open() {
    }

    function close() {
    }

    function toggle() {
    }

    return this;
};

// Set iframe popup into gtalk style
$.fn.popupStyle = function() {
};
