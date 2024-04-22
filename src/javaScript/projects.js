fetch('./src/data/projects.json')
    .then(response => response.json())
    .then(data => {
        const projectsWrapper = document.getElementById('projects-wrapper'); // Verwende das projects-wrapper-Element
        if (data && data["categories"]) {
            data["categories"].forEach(category => {
                const categoryTitle = document.createElement('h3');
                categoryTitle.textContent = category.name;
                projectsWrapper.appendChild(categoryTitle); // Hänge den Kategorietitel an das projects-wrapper-Element an

                const categoryContainer = document.createElement('div');
                categoryContainer.classList.add('project-management-container');

                if (category["projects"]) {
                    category["projects"].forEach(project => {
                        const projectCard = document.createElement('div');
                        projectCard.classList.add('project', 'clickable');
                        projectCard.onclick = function() {
                            flipCard(this);
                        };

                        const projectContent = document.createElement('div');
                        projectContent.classList.add('project-content');

                        const projectFront = document.createElement('div');
                        projectFront.classList.add('project-front');
                        projectFront.innerHTML = `
                            <p class="project-year">${project.year}</p>
                            <h5>${project.name}</h5>
                        `;

                        const projectBack = document.createElement('div');
                        projectBack.classList.add('project-back');

                        // Display project name on the back
                        const projectNameBack = document.createElement('h5');
                        projectNameBack.classList.add('project-name');
                        projectNameBack.textContent = project.name;
                        projectBack.appendChild(projectNameBack);

                        if (project["project_details"] && project["project_details"].length > 0) {
                            const projectDetails = project["project_details"][0];

                            // Funktion zum Erstellen eines umschließenden Div-Elements
                            function createDetailsContainer(headerText, items, containerClass) {
                                if (items && items.length > 0) {
                                    const container = document.createElement('div');
                                    const list = document.createElement('ul');
                                    list.classList.add(containerClass + '-list');

                                    const header = document.createElement('p');
                                    header.classList.add('details-header');
                                    header.textContent = headerText;

                                    items.forEach(item => {
                                        const listItem = document.createElement('li');
                                        // Überprüfen, ob das Element ein Link ist
                                        if (item.link && item["link_name"]) {
                                            const link = document.createElement('a');
                                            link.href = item.link;
                                            link.textContent = item["link_name"];
                                            link.target = "_blank"; // Öffnet den Link in einem neuen Tab
                                            listItem.appendChild(link);
                                        } else {
                                            listItem.textContent = item;
                                        }
                                        list.appendChild(listItem);
                                    });

                                    container.classList.add(containerClass + '-container');
                                    container.appendChild(header);
                                    container.appendChild(list);
                                    return container;
                                }
                                return null;
                            }

                            // Erstellen und Hinzufügen des Divs für Name Affix
                            if (projectDetails["name_affix"]) {
                                const nameAffixBack = document.createElement('p');
                                nameAffixBack.classList.add('name-affix');
                                nameAffixBack.textContent = projectDetails["name_affix"];
                                projectBack.appendChild(nameAffixBack);
                            }

                            // Erstellen und Hinzufügen des Divs für Project Requirements
                            const requirementsContainer = createDetailsContainer("Project Requirements", projectDetails["requirements"], 'project-requirements');
                            if (requirementsContainer) {
                                projectBack.appendChild(requirementsContainer);
                            }

                            // Erstellen und Hinzufügen des Divs für Applied Skills
                            const appliedSkillsContainer = createDetailsContainer("Applied Skills", projectDetails["applied_skills"], 'applied-skills');
                            if (appliedSkillsContainer) {
                                projectBack.appendChild(appliedSkillsContainer);
                            }

                            // Erstellen und Hinzufügen des Divs für Project Links
                            const linksContainer = createDetailsContainer("Links", projectDetails.links, 'project-links');
                            if (linksContainer) {
                                projectBack.appendChild(linksContainer);
                            }
                        } else {
                            // Handle the case where project details are not available
                            const noDetailsMessage = document.createElement('p');
                            noDetailsMessage.textContent = "No project details available";
                            projectBack.appendChild(noDetailsMessage);
                        }

                        projectContent.appendChild(projectFront);
                        projectContent.appendChild(projectBack);
                        projectCard.appendChild(projectContent);
                        categoryContainer.appendChild(projectCard);
                    });
                }

                projectsWrapper.appendChild(categoryContainer); // Hänge die Kategoriecontainer an das projects-wrapper-Element an
            });
        } else {
            console.error('Fehler beim Abrufen der Projekte: Keine Kategorien in den Daten gefunden');
        }
    })
    .catch(error => console.error('Fehler beim Abrufen der Projekte:', error));
