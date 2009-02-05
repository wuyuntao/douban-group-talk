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

// Initialize
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
        'background': '#c3d9ff',
        'width': '320px',
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
    var styles =
        'body { font-size: 12px; }' +
        'body > h1 { background: #c3d9ff; font-size: 14px; line-height: 20px; margin: 0; padding: 2px; position: fixed; top: 0; left: 0; right: 0; }' +
        'body img { padding: 2px; }' +
        'body > .post { font-size: 12px; width: 305px; margin: 5px; padding: 24px 15px 0 0; }' +
        '.post span.mn { font-size: 12px; color: #999; display: block; }' +
        '.post span.pl2 { font-size: 12px; color: black; }' +
        '.post .post-icon { float: right; }' +
        '.post .post-body { margin: 3px; padding: 0; }' +
        '.post .post-body .wrc { margin: 5px 0 0; padding: 3px; }' +
        'body > .reply { width: 300px; margin: 0; padding: 5px 15px 0 5px; border-top: 1px solid #ccc; }' +
        // '.reply img { padding-left: 10px; }' +
        '.reply span.wrap { background: #fff; }' +
        '.reply .wrap h4 { background: #fff; color: #999; line-height: 16px; margin: 0; padding-bottom: 5px; }' +
        '.reply p.wrc { margin: 0; padding: 0; }' +
        '.reply .group_banned { display: none; }' +
        '.reply .reply-icon { float: left; }' +
        '.reply-even, .reply-even .wrap, .reply-even .wrap h4 { background: #e2edff; }' +
        '.reply-even .reply-icon { float: right; }' +
        '';
    var sheet = $('<style></style>')
                    .attr('type', 'text/css')
                    .text(styles)
                    .appendTo('head');
    return this
        .popupTitle()
        .popupPost()
        .popupReply()
        .children('#maxw')
            .hide()
            .end();
};

$.fn.popupTitle = function() {
    return this
        .find('#maxw > h1')
            .appendTo('body')
            .end();
}

$.fn.popupPost = function() {
    var post = $('<div></div>')
                   .attr('class', 'post')
                   .append('<div class="clear"></div>');
    var body = $('<div></div>')
                   .attr('class', 'post-body')
                   .prependTo(post);
    var icon = $('<div></div>')
                   .attr('class', 'post-icon')
                   .prependTo(post);
    return this
        .find('#in_tablem > .wr td.wrtd > a')
            .appendTo(icon)
            .end()
        .find('#in_tablem > .wr td.wrtd + td:first *:lt(5)')
            .appendTo(body)
            .end()
        .append(post);
};

$.fn.popupReply = function() {
    var body = this;
    var replyTable = this.find('#in_tablem > .wr td.wrtd + td:first table.wr');

    $.each(replyTable, function() {
        body.append(createReply($(this)));
    });

    return this
        .find('.reply:even')
            .addClass('reply-even')
            .end();

    function createReply(table) {
        var reply = $('<div></div>')
                       .attr('class', 'reply')
                       .append('<div class="clear"></div>');
        var body = $('<div></div>')
                       .attr('class', 'reply-body')
                       .html(table.find('td:last').html())
                       .prependTo(reply);
        var icon = $('<div></div>')
                   .attr('class', 'reply-icon')
                   .html(table.find('td:first').html())
                   .prependTo(reply);
        return reply
    }
}
