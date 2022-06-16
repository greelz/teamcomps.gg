import requests
import shutil
import os
import subprocess
from math import ceil, sqrt
import psycopg2
from secrets import conn_string

def add_champion(internalName, id, prettyName, primeId, title):
    with psycopg2.connect(conn_string) as conn:
        # Open a cursor to perform database operations
        with conn.cursor() as cur:
            # Execute a command: this creates a new table
            cur.execute("""
                INSERT INTO champions (id, primeid, internalname, prettyname, title) 
                VALUES (%s, %s, %s, %s, %s) ON CONFLICT (id)
                DO UPDATE SET (internalname, prettyname, title) = (EXCLUDED.internalname, EXCLUDED.prettyname, EXCLUDED.title)
            """, 
                (id, primeId, internalName, prettyName, title))

            # Make the changes to the database persistent
            conn.commit()

def get_champions():
    champs = {}
    with psycopg2.connect(conn_string) as conn:
        # Open a cursor to perform database operations
        with conn.cursor() as cur:
            cur.execute('SELECT * FROM champions')
            for x in cur:
                id, primeid = int(x[0]), int(x[1])
                champs[x[2].lower()] = {
                    'id': id,
                    'primeid': primeid,
                    'internalname': x[2],
                    'prettyname': x[3]
                }

    return champs

# What this does
# 1. Download the latest champion.json file for the latest version
# 2. Download and modify all champion images for the latest version
def get_champion_images(curr_patch, base_url):
    # Get the champion.json file
    champion_data = requests.get('http://ddragon.leagueoflegends.com/cdn/{}/data/en_US/champion.json'.format(curr_patch)).json()

    for champion_name in champion_data['data']:
        r = requests.get(base_url.replace('CHAMPIONNAME', champion_name), stream=True)
        if r.status_code == 200:
            with open('../assets/champions/' + champion_name + '.png', 'wb') as f:
                r.raw.decode_content = True
                shutil.copyfileobj(r.raw, f)
        else:
            print("Error reading " + champion_name)

    # With Image Magick installed, convert the images so we remove the ugly borders
    dir = '../assets/champions/'
    for file in os.scandir(dir):
        abs_path = os.path.abspath(file.path)
        subprocess.run("magick convert {} -crop 110x110+5+5 {}".format(abs_path, abs_path))


    return champion_data

def update_champions_in_db(champion_data):
    existing_champs = get_champions() # Dictionary of lowercase internal names with all properties 
    primes = [x for x in range(100000) if is_prime(x)]
    # Also validate the existing database and add any new champions to the database (and update titles if necessary)
    for champion_name in champion_data['data']:
        dic = champion_data['data'][champion_name]
        id = dic['id'] # actually internal name
        id_lower = id.lower()
        name = dic['name'] # pretty name
        title = dic['title'] # title
        key = dic['key'] # id
        primeid = primes[int(key)]
        if id_lower not in existing_champs: # id is actually internalname
            print("{} wasn't in the database. We will add it now.".format(id_lower))
            add_champion(id, key, name, primeid, title)
        
        c = existing_champs[id_lower]
        # These shouldn't change...
        assert(c['internalname'] == id)
        assert(c['id'] == int(key))
        assert(c['primeid'] == primeid)
        assert(c['prettyname'] == name)

        # But we'll still call add_champion to update the titles
        add_champion(id, key, name, primeid, title)


def is_prime(val: int):
    if val < 2:
        return False

    if val == 2:
        return True

    if val % 2 == 0:
        return False

    for i in range(3, ceil(sqrt(val)) + 1, 2):
        if val % i == 0:
            return False
    return True

def main():
    # I get the champion.json file from here: 
    # http://ddragon.leagueoflegends.com/cdn/12.9.1/data/en_US/champion.json
    curr_patch = requests.get('https://ddragon.leagueoflegends.com/api/versions.json').json()[0]
    base_url = 'http://ddragon.leagueoflegends.com/cdn/{}/img/champion/CHAMPIONNAME.png'.format(curr_patch)
    champion_data = get_champion_images(curr_patch, base_url)
    update_champions_in_db(champion_data)

if __name__ == "__main__":
    main()