// ==UserScript==
// @name           Douban Talk
// @namespace      http://blog.luliban.com
// @include        http://www.douban.com/group/*
// @include        http://www.douban.com/group/topic/*
// ==/UserScript==

// Set jquery
var $ = jQuery = unsafeWindow.jQuery;
var console = unsafeWindow.console || { debug: function() {} };

// Main entry
$(function() {
    setTimeout(initial, 0);    // Delay for Mozilla
});

function initial() {
    if (inframe()) {
        $('body').doubanTopicPopupStyle();
    } else {
        var topic = $('#in_table table.olt tr.pl').find('td:first a');

        topic.click(function() {
            $('#douban-talk-popup')
                .doubanTopicPopup({
                    url: $(this).attr('href'),
                    open: true
                });
            return false;
        });
    }
}

// Check if page is in popup
function inframe() {
    return location.href.match(/#douban\-talk\-popup$/);
}

// Popup window
$.fn.doubanTopicPopup = function(action, options) {
    // Shift arguments if action is ommited
    if (typeof action == 'object') {
        options = action;
        action = 'init';
    }

    // Set options
    options = $.extend({
        url: location.href,
        open: false
    }, options || {});

    // Elements
    var popup = this;
    var iframe = this.children('iframe');
    // CSS styles
    var popupStyles = {
        // 'width': '300px',
        'width': '100%',
        'height': '300px',
        'padding': '3px',
        'position': 'fixed',
        'right': '0',
        'bottom': '0',
        'display': 'none',
        'border': '1px solid #ccc'
    };
    var iframeStyles = {
        'border': 'none',
        'overflow-x': 'hidden'
    };

    // Work by action
    switch(action) {
        case 'open': return open();
        case 'close': return close();
        case 'toggle': return toggle();
        case 'init':
        default: return init();
    }

    function init() {
        if (!popup.length) {
            // Create popup and iframe
            popup = $('<div></div>')
                        .attr('id', 'douban-talk-popup')
                        .css(popupStyles)
                        .appendTo('#maxw');
            iframe = $('<iframe></iframe>')
                         .attr('id', 'douban-talk-popup-iframe')
                         .attr('src', validate(options.url))
                         .attr('width', '100%')
                         .attr('height', '100%')
                         .css(iframeStyles)
                         .appendTo(popup);

            // Auto open the popup or just initialize
            if (options.open) return open();
        } else {
            // Update iframe
            iframe.attr('src', validate(options.url));
        }
        return popup;
    }

    function validate(url) {
        var topic = /(http:\/\/www\.douban\.com)?\/group\/topic\/\d+\//;
        if (url.match(topic)) {
            return url + '#douban-talk-popup';
        } else {
            throw new Error("Invalid Topic URL");
        }
    }

    function open() {
        return popup.addClass('popup-open').fadeIn('normal');
    }

    function close() {
        return popup.removeClass('popup-open').fadeOut('normal');
    }

    function toggle() {
        throw new Error("Not Implemented");
    }
};

// Set iframe popup into talk style
$.fn.doubanTopicPopupStyle = function() {
};
