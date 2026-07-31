import json

with open("site_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

projects = data.get("projects", [])

portfolio_str = "export const PORTFOLIO = [\n"
for p in projects:
    desc = p.get("description", "").replace('"', '\\"')
    title = p.get("title", "")
    cat = p.get("category", "")
    catLabel = p.get("categoryLabel", "")
    materials = json.dumps(p.get("materials", []), ensure_ascii=False)
    image = p.get("image", "")
    featured = str(p.get("featured", False)).lower()
    
    portfolio_str += "  {\n"
    portfolio_str += f'    id: {p.get("id", "Date.now()")},\n'
    portfolio_str += f'    title: "{title}",\n'
    portfolio_str += f'    category: "{cat}",\n'
    portfolio_str += f'    categoryLabel: "{catLabel}",\n'
    portfolio_str += f'    description: "{desc}",\n'
    portfolio_str += f'    materials: {materials},\n'
    portfolio_str += f'    image: "{image}",\n'
    portfolio_str += f'    featured: {featured},\n'
    portfolio_str += "  },\n"
portfolio_str += "];\n"

# Now read content.js and replace PORTFOLIO
with open("src/data/content.js", "r", encoding="utf-8") as f:
    content = f.read()

import re
# Regex to match export const PORTFOLIO = [...];
pattern = r"export const PORTFOLIO = \[.*?\];"
new_content = re.sub(pattern, portfolio_str, content, flags=re.DOTALL)

with open("src/data/content.js", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Synchronized PORTFOLIO in src/data/content.js")
