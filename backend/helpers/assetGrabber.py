import requests
import shutil
import json

# I get the champion.json file from here: 
# http://ddragon.leagueoflegends.com/cdn/12.9.1/data/en_US/champion.json

base_url = 'http://ddragon.leagueoflegends.com/cdn/12.9.1/img/champion/CHAMPIONNAME.png'

with open('champion.json', 'rb') as reader: 
    data = json.load(reader)

    for champion_name in data['data']:
        r = requests.get(base_url.replace('CHAMPIONNAME', champion_name), stream=True)
        if r.status_code == 200:
            with open('./champions/' + champion_name + '.png', 'wb') as f:
                r.raw.decode_content = True
                shutil.copyfileobj(r.raw, f)
        else:
            print("Error reading " + champion_name)