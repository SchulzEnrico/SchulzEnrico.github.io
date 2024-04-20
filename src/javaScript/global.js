function flipCard(card) {
    card.classList.toggle('flip');
}

function toggleMenu() {
    document.body.classList.toggle('nav-open');
}

function toggleActive(element) {
    const sectionId = element.getAttribute('href').replace('#', '');
    const section = document.getElementById(sectionId);

    // Entferne den aktiven Link von allen Links
    const activeLinks = document.querySelectorAll('.mobile-nav a');
    activeLinks.forEach(function (link) {
        link.classList.remove('active');
    });

    // Markiere den angeklickten Link als aktiv
    element.classList.add('active');

    // Scrolle zum Abschnitt
    scrollToSection(section);
}

function scrollToSection(section) {
    section.scrollIntoView({
        behavior: 'smooth'
    });
}

$(document).ready(function () {
    // Überwachen des Scrollereignisses
    $(window).scroll(function () {
        // Die Position des Benutzers relativ zu den Abschnitten der Seite erhalten
        const currentPosition = $(this).scrollTop();

        // Überprüfen, welcher Abschnitt der Seite sichtbar ist und entsprechend die aktiven Links aktualisieren
        updateActiveNavLink(currentPosition);

        // Überprüfen, ob der Benutzer an den Anfang der Seite gescrollt ist, und entsprechend die Scroll-to-Top-Schaltfläche anzeigen oder ausblenden
        if (currentPosition > 400) {
            $('.scroll-to-top').addClass('show');
        } else {
            $('.scroll-to-top').removeClass('show');
        }
    });

    // Initialisiere die aktiven Links beim Laden der Seite
    updateActiveNavLink($(window).scrollTop());

    // Zurück zum Seitenanfang scrollen, wenn die Scroll-to-Top-Schaltfläche geklickt wird
    $('.scroll-to-top').click(function (e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, '300');
    });
});

function updateActiveNavLink(currentPosition) {
    $('.section').each(function () {
        const sectionTop = $(this).offset().top;
        const sectionBottom = sectionTop + $(this).outerHeight();

        // Wenn der Benutzer die obere Grenze des Abschnitts überschreitet und nicht den nächsten Abschnitt erreicht hat, markieren Sie den entsprechenden Link im Navigationsmenü als aktiv
        if (currentPosition >= sectionTop && currentPosition < sectionBottom) {
            const sectionId = $(this).attr('id');
            const correspondingNavLink = $('a[href="#' + sectionId + '"]');
            $('.mobile-nav a').removeClass('active'); // Alle Links als inaktiv markieren
            correspondingNavLink.addClass('active'); // Den entsprechenden Link als aktiv markieren
        }
    });
}


/*function toggleActive(element) {
    const isActive = element.classList.contains('active');
    const activeLinks = document.querySelectorAll('.active');
    activeLinks.forEach(function (link) {
        link.classList.remove('active');
    });
    if (!isActive) {
        element.classList.add('active');
        const sectionId = element.getAttribute('href').replace('#', '');
        const section = document.getElementById(sectionId);
        scrollToSection(section);
    }
}
}*/

/*function scrollToSection(section) {
    section.scrollIntoView({
        behavior: 'smooth'
    });*/


    /*
    // Füge diesen JavaScript-Code in deine global.js-Datei ein oder erstelle eine neue Datei dafür
    $(document).ready(function() {
        // Überprüfe, ob der Benutzer 400px nach unten gescrollt hat
        $(window).scroll(function() {
            if ($(this).scrollTop() > 400) {
                $('.scroll-to-top').addClass('show');
            } else {
                $('.scroll-to-top').removeClass('show');
            }
        });

        // Wenn der Button geklickt wird, scrolle nach oben
        $('.scroll-to-top').click(function(e) {
            e.preventDefault();
            $('html, body').animate({scrollTop: 0}, '300');
        });
    });*/

  /*  $(document).ready(function () {
        // Überwachen des Scrollereignisses
        $(window).scroll(function () {
            // Die Position des Benutzers relativ zu den Abschnitten der Seite erhalten
            const currentPosition = $(this).scrollTop();

            // Überprüfen, welcher Abschnitt der Seite sichtbar ist und entsprechend die aktiven Links aktualisieren
            $('.section').each(function () {
                const sectionTop = $(this).offset().top;
                const sectionBottom = sectionTop + $(this).outerHeight();

                // Wenn der Benutzer die obere Grenze des Abschnitts überschreitet und nicht den nächsten Abschnitt erreicht hat, markieren Sie den entsprechenden Link im Navigationsmenü als aktiv
                if (currentPosition >= sectionTop && currentPosition < sectionBottom) {
                    const sectionId = $(this).attr('id');
                    const correspondingNavLink = $('a[href="#' + sectionId + '"]');
                    $('a').removeClass('active'); // Alle Links als inaktiv markieren
                    correspondingNavLink.addClass('active'); // Den entsprechenden Link als aktiv markieren
                }
            });

            // Überprüfen, ob der Benutzer an den Anfang der Seite gescrollt ist, und entsprechend die Scroll-to-Top-Schaltfläche anzeigen oder ausblenden
            if (currentPosition > 400) {
                $('.scroll-to-top').addClass('show');
            } else {
                $('.scroll-to-top').removeClass('show');
            }
        });

        // Zurück zum Seitenanfang scrollen, wenn die Scroll-to-Top-Schaltfläche geklickt wird
        $('.scroll-to-top').click(function (e) {
            e.preventDefault();
            $('html, body').animate({scrollTop: 0}, '300');
        });
    });*/
/*
}*/
