import json
from math import ceil, sqrt
from helpers.database_apis import add_champion, get_champions

def getChampions():
    with open('./assets/champion.json', 'rb') as reader: 
        data = json.load(reader)
        for champ in data['data']:
            c = data['data'][champ]
            yield [c['id'], int(c['key']), c['name']]


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


def create_champions_table():
    primes = [x for x in range(100000) if is_prime(x)]
    for val in getChampions():
        internalName, id, prettyName, primeId = val + [primes[val[1]]]
        add_champion(internalName, id, prettyName, primeId)

def get_champions_from_db():
    # {
    # "266": {
    #     "id": 266,
    #     "primeid": 1709,
    #     "internalname": "Aatrox",
    #     "prettyname": "Aatrox"
    # },
    # "103": {
    #     "id": 103,
    #     "primeid": 569,
    #     "internalname": "Ahri",
    #     "prettyname": "Ahri"
    return get_champions()


def yield_testing():
    x = [1, 2, 3, 4]
    y = []
    for entry in y:
        yield entry

for i in yield_testing():
    print(i)