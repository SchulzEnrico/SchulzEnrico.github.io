function flipCard(card) {
    card.classList.toggle('flip');
}

function toggleMenu() {
    document.body.classList.toggle('nav-open');
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

function scrollToSection(section) {
    section.scrollIntoView({
        behavior: 'smooth'
    });
}

