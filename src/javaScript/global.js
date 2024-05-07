function flipCard(cardElement, projectContent, skillContent) {
    if (cardElement && cardElement.classList.contains("flip")) {
        cardElement.classList.remove("flip");
        if (projectContent) {
            projectContent.style.backfaceVisibility = "hidden";
        }
        if (skillContent) {
            skillContent.style.backfaceVisibility = "hidden";
        }

        document.body.classList.remove('body-scroll-lock');
    } else if (cardElement) {
        cardElement.classList.add("flip");
        if (projectContent) {
            projectContent.style.backfaceVisibility = "visible";
        }
        if (skillContent) {
            skillContent.style.backfaceVisibility = "visible";
        }
        document.body.classList.add('body-scroll-lock');
    }
}

function toggleMenu() {
    const nav = document.querySelector('nav.mobile-nav');
    nav.classList.toggle('nav-open');
}

function toggleActive(element) {
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

const mobileNavLinks = document.querySelectorAll('.mobile-nav.nav-open a');

mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        const navOpenElement = document.querySelector('.nav-open');
        if (navOpenElement) {
            navOpenElement.classList.remove('nav-open');
        }
    });
});

document.querySelector('.mobile-nav').addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        const navOpenElement = document.querySelector('.nav-open');
        if (navOpenElement) {
            navOpenElement.classList.remove('nav-open');
        }
    }
});

function scrollToSection(section) {
    section.scrollIntoView({
        behavior: 'smooth'
    });
}

$(document).ready(function() {
    $(window).scroll(function() {
        if ($(this).scrollTop() > 400) {
            $('.scroll-to-top').addClass('show');
        } else {
            $('.scroll-to-top').removeClass('show');
        }
    });

    $('.scroll-to-top').click(function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, '300');
        toggleActive(document.querySelector('.active'));
    });
});
