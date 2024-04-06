fetch('./src/data/projects.json')
    .then(response => response.json())
    .then(data => {
        const projectsContainer = document.getElementById('projects');
        if (data && data["categories"]) {
            data["categories"].forEach(category => {
                const categoryContainer = document.createElement('div');
                categoryContainer.classList.add('project-management-container');

                const categoryTitle = document.createElement('h3');
                categoryTitle.textContent = category.name;
                categoryContainer.appendChild(categoryTitle);

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
                            const nameAffixBack = document.createElement('p');
                            nameAffixBack.classList.add('name-affix');
                            nameAffixBack.textContent = project["project_details"][0]["name_affix"];
                            projectBack.appendChild(nameAffixBack);

                            const requirementsList = document.createElement('ul');
                            requirementsList.classList.add('project-requirements');
                            if (project["project_details"][0]["requirements"]) {
                                const requirementsHeader = document.createElement('p');
                                requirementsHeader.classList.add('details-header');
                                requirementsHeader.textContent = "Project Requirements";
                                projectBack.appendChild(requirementsHeader);
                                project["project_details"][0]["requirements"].forEach(req => {
                                    const requirementItem = document.createElement('li');
                                    requirementItem.textContent = req;
                                    requirementsList.appendChild(requirementItem);
                                });
                                projectBack.appendChild(requirementsList);
                            }

                            const appliedSkillsList = document.createElement('ul');
                            appliedSkillsList.classList.add('applied-skills');
                            if (project["project_details"][0]["applied_skills"]) {
                                const skillsHeader = document.createElement('p');
                                skillsHeader.classList.add('details-header');
                                skillsHeader.textContent = "Applied Skills";
                                projectBack.appendChild(skillsHeader);
                                project["project_details"][0]["applied_skills"].forEach(skill => {
                                    const skillItem = document.createElement('li');
                                    skillItem.textContent = skill;
                                    appliedSkillsList.appendChild(skillItem);
                                });
                                projectBack.appendChild(appliedSkillsList);
                            }
                        }

// Display links as a list
                        const linksList = document.createElement('ul');
                        linksList.classList.add('project-links');

                        if (Array.isArray(project["project_details"]) && project["project_details"].length > 0 && Array.isArray(project["project_details"][0]["links"])) {
                            const linksHeader = document.createElement('p');
                            linksHeader.classList.add('details-header');
                            linksHeader.textContent = "Links";
                            projectBack.appendChild(linksHeader);

                            const projectLinks = project["project_details"][0]["links"];
                            if (projectLinks.length > 0) {
                                projectLinks.forEach(link => {
                                    const linkItem = document.createElement('li');
                                    const linkAnchor = document.createElement('a');
                                    linkAnchor.href = link.link;
                                    linkAnchor.textContent = link["link_name"];
                                    linkAnchor.target = "_blank"; // Set target attribute to open link in a new tab
                                    linkItem.appendChild(linkAnchor);
                                    linksList.appendChild(linkItem);
                                });
                            } else {
                                const noLinksMessage = document.createElement('p');
                                noLinksMessage.textContent = "No links available";
                                linksList.appendChild(noLinksMessage);
                            }

                            projectBack.appendChild(linksList);
                        } else {
                            // Handle the case where links are not available or not in the expected format
                            const noLinksMessage = document.createElement('p');
                            noLinksMessage.textContent = "No links available";
                            projectBack.appendChild(noLinksMessage);
                        }

                        projectContent.appendChild(projectFront);
                        projectContent.appendChild(projectBack);
                        projectCard.appendChild(projectContent);
                        categoryContainer.appendChild(projectCard);
                    });
                }

                projectsContainer.appendChild(categoryContainer);
            });
        } else {
            console.error('Fehler beim Abrufen der Projekte: Keine Kategorien in den Daten gefunden');
        }
    })
    .catch(error => console.error('Fehler beim Abrufen der Projekte:', error));
