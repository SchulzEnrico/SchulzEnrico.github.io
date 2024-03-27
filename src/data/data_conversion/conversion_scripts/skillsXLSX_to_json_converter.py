import pandas as pd
import json

# Excel-Datei einlesen
excel_file = "../files_to_convert/skills_json.xlsx"
df = pd.read_excel(excel_file)

# Datensatzstruktur für JSON erstellen
data = {"categories": []}

# Durch die Zeilen der Excel-Datei iterieren und Daten strukturieren
for index, row in df.iterrows():
    category_name = row["category"]
    skill_name = row["s_name"].strip()  # Leerzeichen und Zeilenumbrüche entfernen
    topics = row["topics"].strip()
    proficiency = row["proficiency"]
    coach_guided_applied = row["coach_guided_applied"]
    applied_unassisted = row["applied_unassisted"]
    project_name = row["p_name"]
    hours_skill_used = row["hours_skill_used"]
    skill_use_types = row["skill_use_types"]

    # Überprüfen, ob die Kategorie bereits existiert, falls nicht, hinzufügen
    category_exists = False
    for category in data["categories"]:
        if category["name"] == category_name:
            category_exists = True

            # Überprüfen, ob der Skill bereits existiert, falls nicht, hinzufügen
            skill_exists = False
            for skill in category["skills"]:
                if skill["name"] == skill_name:
                    skill_exists = True
                    skill["projects"].append({
                        "name": project_name,
                        "hours_skill_used": hours_skill_used,
                        "skill_use_types": skill_use_types
                    })
                    break

            if not skill_exists:
                category["skills"].append({
                    "name": skill_name,
                    "topics": topics,
                    "proficiency": proficiency,
                    "coach_guided_applied": coach_guided_applied,
                    "applied_unassisted": applied_unassisted,
                    "projects": [{
                        "name": project_name,
                        "hours_skill_used": hours_skill_used,
                        "skill_use_types": skill_use_types
                    }]
                })

            break

    if not category_exists:
        data["categories"].append({
            "name": category_name,
            "skills": [{
                "name": skill_name,
                "topics": topics,
                "proficiency": proficiency,
                "coach_guided_applied": coach_guided_applied,
                "applied_unassisted": applied_unassisted,
                "projects": [{
                    "name": project_name,
                    "hours_skill_used": hours_skill_used,
                    "skill_use_types": skill_use_types
                }]
            }]
        })

# JSON-Datei schreiben
with open("../../skills.json", "w") as outfile:
    json.dump(data, outfile, indent=2)
