from datetime import datetime
from math import prod
from typing import Iterator, TypeVar, Union
from backend.helpers.secrets import conn_string
import psycopg2
from psycopg2 import sql
from backend.helpers.api_classes import QueueType


T = TypeVar('T')
def get_combinations(k: int, elems: list[T]) -> Iterator[list[T]]:
    for i in range(len(elems)):
        if k == 1:
            yield [elems[i]]
        else:
            for next_combination in get_combinations(k - 1, elems[i + 1:]):
                yield [elems[i]] + next_combination

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

champs = get_champions()


def add_games(games):
    with psycopg2.connect(conn_string) as conn:
        with conn.cursor() as cur:
            for match_id in games:
                winners = games[match_id]['winners']
                losers = games[match_id]['losers']
                queue = games[match_id]['queue']
                patch = games[match_id]['patch']
                __add_game(cur, match_id, winners, losers, queue, patch)
    
    conn.commit()
    conn.close()

def __add_game(cur, match_id: str, winners: list[str], losers: list[str], queue: QueueType, patch: str):
    # ensure input is lowercase
    winners_lowercase = [x.lower() for x in winners]
    losers_lowercase = [x.lower() for x in losers]
    winners_by_id = [champs[x]['id'] for x in winners_lowercase]
    losers_by_id = [champs[x]['id'] for x in losers_lowercase]

    if winners_by_id is None or len(winners_by_id) != 5:
        print('Quitting out early, something was wrong with match {}'.format(match_id))
        return

    winner1, winner2, winner3, winner4, winner5 = winners_by_id
    loser1, loser2, loser3, loser4, loser5 = losers_by_id
    cur.execute("""
        INSERT INTO matches (match_id, winner1, winner2, winner3, 
            winner4, winner5, loser1, loser2, loser3, loser4, loser5, 
            queue_type, patch) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (match_id) DO NOTHING
        """, 
        [match_id, winner1, winner2, winner3, winner4, winner5, loser1, loser2, loser3,
                loser4, loser5, queue.value, patch])

    # Need to quit if the cursor didn't do anything in the above statement
    if cur.rowcount == 1:
        # We did an insert, so also do the singles/doubles/etc tables
        insert_into_index_tables(winners_lowercase, losers_lowercase, cur)



# winners:  list of champion names ['missfortune', ..., 'darius'] that will corrolate
#           with champs above
def _add_game(match_id: str, winners: list[str], losers: list[str], queue: QueueType, patch: str):
    with psycopg2.connect(conn_string) as conn:
        # Open a cursor to perform database operations
        with conn.cursor() as cur:
            # Add to matches
            __add_game(cur, match_id, winners, losers, queue, patch)

            # Make the changes to the database persistent

    conn.commit()
    conn.close()

def insert_into_index_tables(winners, losers, cur):
    winners_prime = [champs[x]['primeid'] for x in winners]
    losers_prime = [champs[x]['primeid'] for x in losers]
    
    # Add to other tables
    table_names = ["singles", "doubles", "triples", "quads", "quints"]
    for i in range(1, 6):
        table_name = table_names[i - 1]
        win_query = sql.SQL(""" INSERT INTO {table} (primeid, wins, losses) 
                                VALUES (%s, 1, 0) 
                                ON CONFLICT (primeid) 
                                DO UPDATE SET wins={table}.{column} + 1""") \
            .format(table=sql.Identifier(table_name), column = sql.Identifier("wins"))

        loss_query = sql.SQL(""" INSERT INTO {table} (primeid, wins, losses) 
                                VALUES (%s, 0, 1) 
                                ON CONFLICT (primeid) 
                                DO UPDATE SET losses={table}.{column} + 1""") \
            .format(table=sql.Identifier(table_name), column = sql.Identifier("losses"))

        [cur.execute(win_query, [prod(id)]) for id in get_combinations(i, winners_prime)]
        [cur.execute(loss_query, [prod(id)]) for id in get_combinations(i, losers_prime)]




def add_summoner(puuid):
    # Assumption is we're doing a request right now
    with psycopg2.connect(conn_string) as conn:
        # Open a cursor to perform database operations
        with conn.cursor() as cur:
            # Execute a command: this creates a new table
            cur.execute("""
                INSERT INTO players (puuid)
                VALUES (%s)
                ON CONFLICT (puuid) 
                DO UPDATE SET latest_query_time=current_timestamp 
            """, [puuid])

            conn.commit()

def get_summoner_time(puuid: str) -> Union[tuple[datetime], None]:
    with psycopg2.connect(conn_string) as conn:
        # Open a cursor to perform database operations
        with conn.cursor() as cur:
            # Execute a command: this creates a new table
            cur.execute("""
                SELECT latest_query_time from players
                WHERE players.puuid = %s
            """, [puuid])

            return cur.fetchone()

def days_since_last_request_for_summoner(puuid: str) -> Union[float, None]:
    time = get_summoner_time(puuid)
    if time is not None:
        time = time[0]
        time_delta = datetime.now(time.tzinfo) - time
        days_since_last_request = time_delta.total_seconds() / 86400 # seconds in a day
        return days_since_last_request
    else:
        # This puuid wasn't found in the dictionary
        return None


def get_match_ids_not_yet_in_database(match_ids: list[str]) -> list[str]:
    unique_ids = []
    with psycopg2.connect(conn_string) as conn:
        # Open a cursor to perform database operations
        with conn.cursor() as cur:
            # Execute a command: this creates a new table
            cur.execute("""
                SELECT match_id 
                FROM matches
                WHERE match_id = ANY(%s)
            """, [match_ids])
            
            dups = [x[0] for x in cur.fetchall()]
            return list(set(match_ids) - set(dups))



def test():
    puuid = 'WzTF9enaSooCaj0_GiPiBJRTgtbRXIGHgsytojldRFYaipc5CyogjCM55dDvDpBPu9Ie1Ao86V3K2A'
    time = get_summoner_time(puuid)
    if time is not None:
        time = time[0]
        time_delta = datetime.now(time.tzinfo) - time
        days_since_last_request = time_delta.total_seconds() / 60 / 60 / 24
        print('Last request for this user was {} days ago'.format(days_since_last_request))
