// script loaded in all pages

document.documentElement.className += ' js';

$(function () {
    enquire.register('screen and (max-width: 479px)', {
        match: function () {
            // ToDo: <nav> compact
        }
    }).register('screen and (min-width: 480px)', {
        match: function () {
            // ToDo: <nav> expanded
        }
    });

});
