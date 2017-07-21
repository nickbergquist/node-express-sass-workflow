// script loaded in all pages

document.documentElement.className += ' js';

$(function () {
    enquire.register('screen and (max-width: 479px)', {
        match: function () {
            siteNavBehaviour.navCondensed();
        }
    }).register('screen and (min-width: 480px)', {
        match: function () {
            siteNavBehaviour.navExpanded();
        }
    });

});


// METHODS

var siteNavBehaviour = {
    navCondensed: function () {
        if (!$('header .nav-button-show').length) {
            var $headerNav = $('#nav-site');
            var $buttonNavVisibility = $('<button type="button" class="nav-button-show" aria-expanded="false" aria-controls="nav-site"><span>Show/Hide</span></button>');

            $headerNav.find('a').attr('tabindex', -1);

            $buttonNavVisibility.on('click', function () {
                if (!$headerNav.hasClass('active')) {
                    $headerNav.find('a').attr('tabindex', 0);
                    $headerNav.addClass('active');
                    $(this).addClass('active').attr('aria-expanded', 'true');
                } else {
                    $headerNav.find('a').attr('tabindex', -1);
                    $headerNav.removeClass('active');
                    $(this).removeClass('active').attr('aria-expanded', 'false');
                }
            });

            $headerNav.find('a').last().keydown(function (e) {
                if (e.shiftKey && e.keyCode == 9) { // 'Shift + Tab' : navigation backwards
                    return; // don't close the <nav>
                } else if (e.keyCode == 9) { // 'Tab' forwards only
                    $($buttonNavVisibility).click();
                }
            });

            // close the <nav> if navigation backwards beyond the control
            $buttonNavVisibility.on('keydown', function (e) {
                if (e.shiftKey && e.keyCode == 9) { // 'Shift + Tab'
                    if ($headerNav.hasClass('active')) {
                        $($buttonNavVisibility).click();
                    }
                }
            });

            // close the <nav> if user input made elsewhere in the page 
            $('html').on('click', function (e) {
                if ($headerNav.hasClass('active')) {
                    var $target = $(e.target); //console.log('click', e.target);

                    if ((!$target.is($buttonNavVisibility)) && ($target.parents('#nav-site').length == 0)) {
                        $($buttonNavVisibility).click();
                    }
                }
            });

            $headerNav.before($buttonNavVisibility);
        }
    },
    navExpanded: function () {
        $('#nav-site').removeClass('active');
        if ($('header .nav-button-show').length) {
            $('header .nav-button-show').remove();
        }
    }
};
