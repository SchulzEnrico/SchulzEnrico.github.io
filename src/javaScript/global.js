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

// Diese Funktion steuert die Sichtbarkeit der Projects-Sektion basierend auf dem Status der Skills-Sektion
function toggleProjectsVisibility(isSkillsOpen) {
    const projectsSection = document.getElementById('projects');
    if (isSkillsOpen) {
        projectsSection.style.display = 'none'; // Verstecke die Projects-Sektion, wenn die Skills-Sektion geöffnet ist
    } else {
        projectsSection.style.display = 'block'; // Zeige die Projects-Sektion, wenn die Skills-Sektion geschlossen ist
    }
}

// Diese Funktion wird aufgerufen, wenn die Skills-Sektion geöffnet oder geschlossen wird
function toggleSkills(isOpen) {
    const skillsSection = document.getElementById('skills');
    if (isOpen) {
        skillsSection.classList.add('open'); // Füge der Skills-Sektion die Klasse 'open' hinzu, um anzuzeigen, dass sie geöffnet ist
        toggleProjectsVisibility(true); // Verstecke die Projects-Sektion, wenn die Skills-Sektion geöffnet wird
    } else {
        skillsSection.classList.remove('open'); // Entferne die Klasse 'open' von der Skills-Sektion, um anzuzeigen, dass sie geschlossen ist
        toggleProjectsVisibility(false); // Zeige die Projects-Sektion, wenn die Skills-Sektion geschlossen wird
    }
}

// Füge einen Event-Listener hinzu, um zu überwachen, ob die Skills-Sektion geöffnet oder geschlossen wird
const skillsSection = document.getElementById('skills');
skillsSection.addEventListener('click', function() {
    const isOpen = this.classList.contains('open');
    toggleSkills(!isOpen);
});

// Initialisierung: Stelle sicher, dass die Projects-Sektion sichtbar ist, wenn die Seite geladen wird
toggleProjectsVisibility(false);

// Event-Listener für den "Close" Button in den Skills hinzufügen
document.addEventListener('click', function(event) {
    const closeButton = event.target.closest('.close-button');
    if (closeButton) {
        const skillElement = closeButton.closest('.skill');
        if (skillElement) {
            flipCard(skillElement);
            toggleProjectsVisibility(true); // Zeige die Projects-Sektion, wenn der "Close" Button in den Skills geklickt wird
        }
    }
});