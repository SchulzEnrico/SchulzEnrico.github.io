function flipCard(cardElement, projectContent, skillContent) {
    if (cardElement && cardElement.classList.contains("flip")) {
        cardElement.classList.remove("flip");
        if (projectContent) {
            projectContent.style.backfaceVisibility = "hidden";
        }
        if (skillContent) {
            skillContent.style.backfaceVisibility = "hidden";
        }
        toggleProjectsVisibility(false);
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

function toggleProjectsVisibility(isSkillsOpen) {
    const projectsSection = document.getElementById('projects');
    if (isSkillsOpen) {
        projectsSection.style.display = 'none';
    } else {
        projectsSection.style.display = 'block';
    }
}

// Diese Funktion wird aufgerufen, wenn die Skills-Sektion geöffnet oder geschlossen wird
function toggleSkills(isOpen) {
    const skillsSection = document.getElementById('skills');
    if (isOpen) {
        skillsSection.classList.add('open');
        toggleProjectsVisibility(true);
    } else {
        skillsSection.classList.remove('open');
        toggleProjectsVisibility(false);
    }
}

const skillsSection = document.getElementById('skills');
skillsSection.addEventListener('click', function() {
    const isOpen = this.classList.contains('open');
    toggleSkills(!isOpen);
});

toggleProjectsVisibility(false);

document.addEventListener('click', function(event) {
    const closeButton = event.target.closest('.close-button');
    if (closeButton) {
        const skillElement = closeButton.closest('.skill');
        if (skillElement) {
            flipCard(skillElement);
            toggleProjectsVisibility(true);
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Nachdem die Seite vollständig geladen wurde

    // Simuliere die Animation abgeschlossen
    setTimeout(function() {
        document.getElementById("credits").classList.add("animation-completed");
    }, 5000); // Hier 5000 ms als Beispiel für die Dauer der Animation, bitte anpassen
});