import json

with open("site_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for project in data.get("projects", []):
    img = project.get("image", "")
    if "modern_majlis.jpg" in img:
        project["image"] = "/assets/images/portfolio_majlis_modern_1784490542736.jpg"
    elif img.startswith("/src/"):
        project["image"] = img.replace("/src/", "/")

    gallery = project.get("gallery", [])
    new_gallery = []
    for g in gallery:
        if "modern_majlis.jpg" in g:
            new_gallery.append("/assets/images/portfolio_majlis_modern_1784490542736.jpg")
        elif g.startswith("/src/"):
            new_gallery.append(g.replace("/src/", "/"))
        else:
            new_gallery.append(g)
    project["gallery"] = new_gallery

with open("site_data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("site_data.json fixed!")

# Now content.js
with open("src/data/content.js", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('"/assets/images/modern_majlis.jpg"', 'portfolioMajlisModern')
content = content.replace('image: portfolioMajlisModern', 'image: "/assets/images/portfolio_majlis_modern_1784490542736.jpg"')
content = content.replace('image: portfolioMajlisClassic', 'image: "/assets/images/portfolio_majlis_classic_1784490556781.jpg"')
content = content.replace('image: portfolioCorridorClassic', 'image: "/assets/images/portfolio_corridor_classic_1784490570233.jpg"')

with open("src/data/content.js", "w", encoding="utf-8") as f:
    f.write(content)

print("content.js fixed!")
