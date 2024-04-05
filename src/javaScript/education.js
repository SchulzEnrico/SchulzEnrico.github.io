const educations = ['Multipotentiality', 'Web-Designer & Developer', 'Product Owner', 'Scrum Master', 'Project Manager', 'Wholesale & export merchant'];
const typingDelays = [10, 25, 110, 90, 10, 10, 15, 75, 10, 5, 30];

let currentIndex = 0;

function generateDelays(length) {
    const delays = [];
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * typingDelays.length);
        const baseDelay = typingDelays[randomIndex];
        const randomFactor = Math.random() * 0.5 + 0.75;
        delays.push(Math.floor(baseDelay * randomFactor));
    }
    return delays;
}

function displayNextEducation() {
    const educationElement = document.getElementById('educations');
    const currentEducation = educations[currentIndex];
    const currentText =educationElement.textContent;
    const remainingText = currentEducation.substring(currentText.length);

    if (remainingText.length > 0) {
        const delays = generateDelays(remainingText.length);
        addNextCharacter(0, remainingText, delays);
    } else {
        setTimeout(eraseEducation, 1000);
    }

    const dotElement = document.getElementById('educations-dot');
    dotElement.style.animationDelay = `${Math.random() * 1.5}s`;
}

function addNextCharacter(index, remainingText, delays) {
    const educationElement = document.getElementById('educations');
    const nextCharacter = remainingText.charAt(index);
    educationElement.textContent += nextCharacter;
    educationElement.style.width = educationElement.scrollWidth + 'px';

    if (index < remainingText.length - 1) {
        const randomDelay = Math.random() * 200 + 100;
        setTimeout(function() {
            addNextCharacter(index + 1, remainingText, delays);
        }, delays[index] + randomDelay);
    } else {
        setTimeout(eraseEducation, 1000);
    }
}

function eraseEducation() {
    const educationElement = document.getElementById('educations');
    const currentText = educationElement.textContent;

    if (currentText.length > 0) {
        educationElement.textContent = currentText.substring(0, currentText.length - 1);
        educationElement.style.width = 'auto';
        const delay = Math.random() * 50 + 50;
        setTimeout(eraseEducation, delay);
    } else {
        setTimeout(nextEducation, 500);
    }
}

function nextEducation() {
    currentIndex = (currentIndex + 1) % educations.length;
    const educationElement = document.getElementById('educations');
    educationElement.textContent = '';
    educationElement.style.width = '0';
    setTimeout(displayNextEducation, 0);
}

setTimeout(function() {
    displayNextEducation();

}, 0);