import csv
import json
import os

csv_path = "JLPT Grammar.xlsx - full list.csv"
output_path = os.path.join("client", "src", "data", "grammarPatterns.js")

all_patterns = {
    'N5': [],
    'N4': [],
    'N3': [],
    'N2': [],
    'N1': []
}

if not os.path.exists(csv_path):
    print(f"Error: CSV file not found at {csv_path}")
    exit(1)

with open(csv_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for row in reader:
        if not row or len(row) < 5:
            continue
        
        level = row[0].strip().upper()
        if level not in all_patterns:
            continue
            
        pattern = row[2].strip()
        meaning = row[4].strip()
        
        # Skip header or empty rows if any
        if not pattern or pattern == "Grammar":
            continue
            
        all_patterns[level].append({
            'pattern': pattern,
            'meaning': meaning
        })

# Write the JS file
with open(output_path, 'w', encoding='utf-8') as out_f:
    out_f.write("export const GRAMMAR_PATTERNS = ")
    # Pretty-print JSON with 2-space indentation
    json.dump(all_patterns, out_f, ensure_ascii=False, indent=2)
    out_f.write(";\n")

# Verify count
for lvl, pts in all_patterns.items():
    print(f"{lvl}: {len(pts)} patterns imported.")

print("Done! Saved to client/src/data/grammarPatterns.js")
