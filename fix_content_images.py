import json

with open("src/data/content.js", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('"/assets/images/modern_majlis.jpg"', 'portfolioMajlisModern')
content = content.replace('"/src/assets/images/portfolio_majlis_classic_1784490556781.jpg"', 'portfolioMajlisClassic')
content = content.replace('"/src/assets/images/portfolio_corridor_classic_1784490570233.jpg"', 'portfolioCorridorClassic')
content = content.replace('"/src/assets/images/interior_card_bg_1784515033104.jpg"', 'interiorCardBg')
content = content.replace('"/assets/images/office_desk.png"', 'officeDeskImg')
content = content.replace('"/src/assets/images/insulation_card_bg_1784517415029.jpg"', 'insulationCardBg')
content = content.replace('"/src/assets/images/aluminum_card_bg_1784516085266.jpg"', 'aluminumCardBg')

with open("src/data/content.js", "w", encoding="utf-8") as f:
    f.write(content)

with open("site_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for p in data.get("projects", []):
    img = p.get("image", "")
    if "modern_majlis.jpg" in img:
        p["image"] = "/assets/images/portfolio_majlis_modern_1784490542736.jpg"
    elif img.startswith("/src/"):
        p["image"] = img.replace("/src/", "/")

with open("site_data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Fixed!")
