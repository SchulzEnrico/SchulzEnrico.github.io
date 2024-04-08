$(document).ready(function () {
    try {
        $('portfolio').ripples({
            resolution: 1080,
            dropRadius: 20, //px
            perturbance: 0.03,
        });

        $('.ripples-container-large').ripples({
            resolution: 1080,
            dropRadius: 10, //px
            perturbance: 0.03,
            /*interactive: false*/
        });
        $('.ripples-container-small').ripples({
            resolution: 256,
            dropRadius: 20, //px
            perturbance: 1,
            /*interactive: false*/
        });

    } catch (e) {
        $('.error').show().text(e);
    }

    $('.js-ripples-disable').on('click', function () {
        $('main, .ripples-container-large, .ripples-container-small').ripples('destroy');
        $(this).hide();
    });

    $('.js-ripples-play').on('click', function () {
        $('header, .ripples-container-large, .ripples-container-small').ripples('play');
    });

    $('.js-ripples-pause').on('click', function () {
        $('main, .ripples-container-large, .ripples-container-small').ripples('pause');
    });

    setInterval(function () {
        const $el = $('portfolio');
        const x = Math.random() * $el.outerWidth();
        const y = Math.random() * $el.outerHeight();
        const dropRadius = 20;
        const strength = 0.04 + Math.random() * 0.04;

        $el.ripples('drop', x, y, dropRadius, strength);
    }, 1000);
});