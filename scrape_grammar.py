import requests
from bs4 import BeautifulSoup
import json
import os

levels = ['n5', 'n4', 'n3', 'n2', 'n1']
all_grammar = {}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

for level in levels:
    print(f"Scraping {level}...")
    url = f"https://jlptsensei.com/jlpt-{level}-grammar-list/"
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch {level}")
        continue
        
    soup = BeautifulSoup(response.text, 'html.parser')
    table = soup.find('table', id='jlpt-grammar-table')
    if not table:
        print(f"No table found for {level}")
        continue
        
    grammar_list = []
    for row in table.find('tbody').find_all('tr'):
        cols = row.find_all('td')
        if len(cols) >= 3:
            pattern = cols[1].get_text(strip=True)
            meaning = cols[2].get_text(strip=True)
            if pattern:
                grammar_list.append({
                    'pattern': pattern,
                    'meaning': meaning
                })
    
    all_grammar[level.upper()] = grammar_list
    print(f"Found {len(grammar_list)} patterns for {level.upper()}")

with open('client/src/data/grammarPatterns.json', 'w', encoding='utf-8') as f:
    json.dump(all_grammar, f, ensure_ascii=False, indent=2)

print("Done! Saved to client/src/data/grammarPatterns.json")
