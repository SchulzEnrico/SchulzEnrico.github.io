// Funktion zum Bereinigen des Skill-Namens für das ID-Attribut
function cleanForId(name) {
    return name.trim().toLowerCase().replace(/\s+/g, '');
}

fetch('./src/data/skills.json')
    .then(response => response.json())
    .then(data => {
        const skillsContainer = document.getElementById('skills-wrapper');
        const totalHours = data["categories"].reduce((total, category) => {
            return total + category["skills"].reduce((acc, skill) => acc + skill["coach_guided_applied"] + skill["applied_unassisted"], 0);
        }, 0);

        data["categories"].forEach(category => {
            const categoryContainer = document.createElement('div');
            categoryContainer.id = cleanForId(category.name);
            categoryContainer.classList.add('category-container');
            categoryContainer.innerHTML = `
                <h3>${category.name}</h3>
            `;

            const categorySkillsContainer = document.createElement('div');
            categorySkillsContainer.classList.add('category-skills-container');

            category["skills"].forEach(skill => {
                const skillId = cleanForId(skill.name);

                const appliedTotalPercent = ((skill["coach_guided_applied"] + skill["applied_unassisted"]) / totalHours) * 200;
                const coachGuidedAppliedPercent = (skill["coach_guided_applied"] / totalHours) * 200;
                const appliedUnassistedPercent = (skill["applied_unassisted"] / totalHours) * 200;

                const skillElement = document.createElement('div');
                skillElement.classList.add('skill');
                skillElement.addEventListener('click', () => flipCard(skillElement));
                skillElement.innerHTML = `
                    <div class="skill-content">
                        <div class="skill-front">
                            <h4 class="skill-name">${skill.name}</h4>
                            <div class="proficiency-chart" id="proficiency-chart-${skillId}"></div>
                        </div>
                        <div class="skill-back">
                            <h4 class="skill-name">${skill.name}</h4>
                            <div class="skill-close-button-container">
                             <button id="skill-close-button" class="close-button">
                               <i class="fa-regular fa-circle-xmark i-close skill-close"></i>
                            </button>
                            </div>
                            <div class="topics-container">
                            <h5>Topics</h5>
                                <ul>
                                    ${skill["topics"].split(',').map(topic => `<li>${topic.trim()}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="skill-project-use-container">
                                <h5>Used in Projects</h5>
                                <ul class="project-list">
                                    ${skill["projects"].map(project => `<li> <span class="project-name">${project.name}</span>
                                                                            <ul>
                                                                             <li>Applied: <span class="usage-data">${project["hours_skill_used"]}h</span></li>
                                                                             <li>Usage: <span class="usage-data">${project["skill_use_types"]}</span></li>
                                                                            </ul>
                                                                        </li>`).join('')}
                                </ul>
                            </div>
                            <div class="skill-bar-container">
                                <div class="skill-bar">
                                    <div class="skill-bar-fill coach-guided" style="width: ${coachGuidedAppliedPercent}%">
                                    </div>
                                    <div class="skill-bar-fill unassisted" style="width: ${appliedUnassistedPercent}%">
                                    </div>
                                    <div class="skill-bar-fill total-applied" style="width: ${appliedTotalPercent}%">
                                    </div>
                                </div>
                                <div class="skill-legend">
                                    <div class="skill-legend-item">
                                        <div class="skill-legend-label">Coach Guided</div>
                                        <div class="skill-bar-fill coach-guided"></div>
                                          <span class="skill-bar-value skill-bar-value-coach-guided">${coachGuidedAppliedPercent.toFixed(2)}%</span>
                                    </div>
                                    <div class="skill-legend-item">
                                        <div class="skill-legend-label">Unassisted</div>
                                        <div class="skill-bar-fill unassisted"></div>
                                        <span class="skill-bar-value skill-bar-value-unassisted">${appliedUnassistedPercent.toFixed(2)}%</span>
                                    </div>
                                    <div class="skill-legend-item">
                                        <div class="skill-legend-label">Total Applied</div>
                                        <div class="skill-bar-fill total-applied"></div>
                                        <span class="skill-bar-value skill-bar-value-total-applied">${appliedTotalPercent.toFixed(2)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                const proficiencyChartContainer = skillElement.querySelector(`#proficiency-chart-${skillId}`);
                drawProficiencyChart(proficiencyChartContainer, skill["proficiency"]);

                const skillBack = skillElement.querySelector('.skill-back');
                skillBack.addEventListener('click', (event) => {
                    event.stopPropagation(); // Verhindere das Bubbling des Klickereignisses
                });

                const closeButton = skillElement.querySelector('.close-button');

                closeButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    flipCard(skillElement);
                });
                categorySkillsContainer.appendChild(skillElement);
            });

            categoryContainer.appendChild(categorySkillsContainer);
            skillsContainer.appendChild(categoryContainer);
        });
    })
    .catch(error => console.error('Error loading skills:', error));

// Funktion zum Zeichnen eines Kreisdiagramms basierend auf der Proficiency
function drawProficiencyChart(container, proficiency) {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const progress = (100 - proficiency) / 100 * circumference; // Richtung gegen den Uhrzeigersinn

    // SVG-Element erstellen
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "130");
    svg.setAttribute("height", "130");

    // Gruppen-Element erstellen
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("transform", `rotate(-90 65 65)`); // Um 90 Grad gegen den Uhrzeigersinn drehen

    // Kreis-Hintergrund erstellen
    const circleBackground = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleBackground.setAttribute("cx", "65"); // Horizontal zentriert
    circleBackground.setAttribute("cy", "65"); // Vertikal zentriert
    circleBackground.setAttribute("r", radius.toString());
    circleBackground.setAttribute("stroke", "#424244");
    circleBackground.setAttribute("stroke-width", "10");
    circleBackground.setAttribute("fill", "none");
    group.appendChild(circleBackground);

    // Kreis-Fortschritt erstellen
    const circleProgress = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleProgress.setAttribute("cx", "65"); // Horizontal zentriert
    circleProgress.setAttribute("cy", "65"); // Vertikal zentriert
    circleProgress.setAttribute("r", radius.toString());
    circleProgress.setAttribute("stroke", "#460505");
    circleProgress.setAttribute("stroke-width", "10");
    circleProgress.setAttribute("fill", "none");
    circleProgress.setAttribute("stroke-dasharray", `${circumference} ${circumference}`);
    circleProgress.setAttribute("stroke-dashoffset", progress.toString());
    circleProgress.setAttribute("stroke-linecap", "round"); // Runde Seiten des Kreises
    group.appendChild(circleProgress);

    // Div für Text erstellen
    const textDiv = document.createElement("div");
    textDiv.classList.add("proficiency");
    textDiv.textContent = `${proficiency}%`;
    textDiv.setAttribute("title", "proficiency");
    container.appendChild(textDiv);

    // Gruppen-Element dem SVG-Element hinzufügen
    svg.appendChild(group);

    // SVG dem Container hinzufügen
    container.appendChild(svg);
}

