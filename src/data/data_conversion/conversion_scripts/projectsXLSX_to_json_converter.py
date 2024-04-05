import pandas as pd
import json

# Excel-Datei einlesen
excel_file = "../files_to_convert/projects_json.xlsx"
df = pd.read_excel(excel_file)

# Datensatzstruktur für JSON erstellen
data = {"categories": []}

# Durch die Zeilen der Excel-Datei iterieren und Daten strukturieren
for index, row in df.iterrows():
    category_name = row["category"]
    project_name = str(row["p_name"]).strip()  # Hier wird der Wert in einen String konvertiert
    year = row["year"]
    name_affix = row["name_affix"]
    description = row["description"]
    requirements = row["requirements"]
    applied_skills = row["applied_skills"]
    link = row["link"]
    link_name = row["l_name"]

    # Überprüfen, ob die Kategorie bereits existiert, falls nicht, hinzufügen
    category_exists = False
    for category in data["categories"]:
        if category["name"] == category_name:
            category_exists = True

            # Überprüfen, ob das Projekt bereits existiert, falls nicht, hinzufügen
            project_exists = False
            for project in category["projects"]:
                if project["name"] == project_name:
                    project_exists = True
                    # Prüfen, ob das Project Detail bereits hinzugefügt wurde
                    detail_exists = False
                    for detail in project["project_details"]:
                        if detail["name_affix"] == name_affix:
                            detail_exists = True
                            break
                    # Nur hinzufügen, wenn das Project Detail noch nicht existiert
                    if not detail_exists:
                        project["project_details"].append({
                            "name_affix": name_affix,
                            "requirements": requirements.split(";"),  # Aufteilen der Anforderungen in eine Liste
                            "applied_skills": applied_skills.split(";"),  # Aufteilen der angewandten Fähigkeiten in eine Liste
                            "links": []  # Hinzufügen einer leeren Liste für Links
                        })
                    project["project_details"][0]["links"].append({"link": link, "link_name": link_name})  # Hinzufügen des Links zu den Links des Projekts
                    break

            if not project_exists:
                category["projects"].append({
                    "name": project_name,
                    "year": year,
                    "project_details": [{
                        "name_affix": name_affix,
                        "requirements": requirements.split(";"),  # Aufteilen der Anforderungen in eine Liste
                        "applied_skills": applied_skills.split(";"),  # Aufteilen der angewandten Fähigkeiten in eine Liste
                        "links": [{"link": link, "link_name": link_name}]  # Hinzufügen des Links als Liste
                    }]
                })

            break

    if not category_exists:
        data["categories"].append({
            "name": category_name,
            "projects": [{
                "name": project_name,
                "year": year,
                "project_details": [{
                    "name_affix": name_affix,
                    "requirements": requirements.split(";"),  # Aufteilen der Anforderungen in eine Liste
                    "applied_skills": applied_skills.split(";"),  # Aufteilen der angewandten Fähigkeiten in eine Liste
                    "links": [{"link": link, "link_name": link_name}]  # Hinzufügen des Links als Liste
                }]
            }]
        })

# JSON-Datei schreiben
with open("../../projects.json", "w") as outfile:
    json.dump(data, outfile, indent=2)
