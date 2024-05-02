document.addEventListener('DOMContentLoaded', function() {
    fetch('./src/data/projects.json')
        .then(response => response.json())
        .then(data => {
            const projectsWrapper = document.getElementById('projects-wrapper');
            if (data && data["categories"]) {
                data["categories"].forEach(category => {
                    const categoryTitle = document.createElement('h3');
                    categoryTitle.textContent = category.name;
                    projectsWrapper.appendChild(categoryTitle);

                    const categoryContainer = document.createElement('div');
                    categoryContainer.classList.add('project-management-container');

                    if (category["projects"]) {
                        category["projects"].forEach(project => {
                            const projectCard = document.createElement('div');
                            projectCard.classList.add('project', 'clickable');

                            const projectContent = document.createElement('div');
                            projectContent.classList.add('project-content');

                            const projectFront = document.createElement('div');
                            projectFront.classList.add('project-front');
                            projectFront.innerHTML = `<p class="project-year">${project.year}</p>
                                                         <h5>${project.name}</h5>`;
                            projectFront.addEventListener('click', () => flipCard(projectCard));

                            const projectBack = document.createElement('div');
                            projectBack.classList.add('project-back');

                            const closeButton = document.createElement('button');
                            closeButton.classList.add('close-button');
                            closeButton.id = 'project-close-button';
                            closeButton.innerHTML = '<i class="fa-regular fa-circle-xmark i-close project-close"></i>';
                            closeButton.addEventListener('click', () => flipCard(projectCard));

                            // Display project name on the back
                            const projectNameBack = document.createElement('h5');
                            projectNameBack.classList.add('project-name');
                            projectNameBack.textContent = project.name;
                            projectBack.appendChild(projectNameBack);

                            if (project["project_details"] && project["project_details"].length > 0) {
                                const projectDetails = project["project_details"][0];
                                const projectDetailsDiv = document.createElement('div');
                                projectDetailsDiv.classList.add('project-details');

                                // Funktion zum Erstellen eines umschließenden Div-Elements für Projekt-Details-Listen
                                function createDetailsContainer(headerText, items, containerClass) {
                                    if (items && items.length > 0) {
                                        const container = document.createElement('div');
                                        const header = document.createElement('p');
                                        header.classList.add('details-header');
                                        header.textContent = headerText;

                                        const list = document.createElement('ul');
                                        list.classList.add(containerClass + '-list');
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
                                        projectDetailsDiv.appendChild(container);
                                    }
                                }

                                // Erstellen und Hinzufügen des Divs für Name Affix
                                if (projectDetails["name_affix"]) {
                                    const nameAffixBack = document.createElement('p');
                                    nameAffixBack.classList.add('name-affix');
                                    nameAffixBack.textContent = projectDetails["name_affix"];
                                    projectBack.appendChild(nameAffixBack);
                                }

                                // Erstellen und Hinzufügen der Divs für Project Requirements, Applied Skills und Project Links
                                createDetailsContainer("Project Requirements", projectDetails["requirements"], 'project-requirements');
                                createDetailsContainer("Applied Skills", projectDetails["applied_skills"], 'applied-skills');
                                createDetailsContainer("Links", projectDetails.links, 'project-links');

                                // Erstellen und Hinzufügen der Beschreibung auf der Rückseite des Projekt-Divs
                                if (projectDetails["description"]) {
                                    const descriptionDiv = document.createElement('div');
                                    descriptionDiv.classList.add('project-description');
                                    const descriptionParagraph = document.createElement('p');
                                    descriptionParagraph.textContent = projectDetails["description"];
                                    descriptionDiv.appendChild(descriptionParagraph);
                                    projectBack.appendChild(descriptionDiv);
                                }

                                projectBack.appendChild(projectDetailsDiv);
                            } else {
                                // Handle the case where project details are not available
                                const noDetailsMessage = document.createElement('p');
                                noDetailsMessage.textContent = "No project details available";
                                projectBack.appendChild(noDetailsMessage);
                            }

                            projectContent.appendChild(projectFront);
                            projectContent.appendChild(projectBack);
                            projectBack.appendChild(closeButton);

                            projectCard.appendChild(projectContent);
                            categoryContainer.appendChild(projectCard);
                        });
                    }
                    projectsWrapper.appendChild(categoryContainer);
                });

            } else {
                console.error('Fehler beim Abrufen der Projekte: Keine Kategorien in den Daten gefunden');
            }
        })
        .catch(error => console.error('Fehler beim Abrufen der Projekte:', error));
});
