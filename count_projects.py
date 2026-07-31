import json
with open('src/data/content.js', 'r') as f:
    content = f.read()
    
    # We can just count the number of items in PORTFOLIO list.
    # A simple way is to count "{ id:" after "export const PORTFOLIO"
    portfolio_str = content.split("export const PORTFOLIO")[1]
    import re
    ids = re.findall(r'id:\s*\d+', portfolio_str)
    print("PORTFOLIO count:", len(ids))
