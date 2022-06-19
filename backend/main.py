import time
from helpers.api_classes import Region
from helpers.riot_apis import _get_match, _get_players_in_division, get_all_match_ids_for_puuid, get_all_players_in_division, \
    QueueType, Queue, Tier, Division, get_match_results, _get_puuid_by_name, _get_master_leagues, _get_grandmaster_leagues, _get_challenger_leagues
from helpers.database_apis import add_games, add_summoner, days_since_last_request_for_summoner, \
    get_match_ids_not_yet_in_database 
from multiprocessing import Pool




def work(args):
    (match_id, region) = args
    game = _get_match(match_id, region)
    match_results = get_match_results(game)
    if match_results is not None:
        return match_results
    else:
        print('Match {} wasn\'t loaded correctly'.format(match_id))



if __name__ == "__main__": 
    count = 0
    region: Region = Region.EuWest
    queue = Queue.RANKED_SOLO_5x5
    tier = Tier.I
    division = Division.DIAMOND

    for player in get_all_players_in_division(queue, tier, division, region):
        count += 1
        summoner = player.summonerName

        puuid = _get_puuid_by_name(summoner, region)
        if puuid is None:
            continue

        # Don't repeat summoners unless they're played for a month since last query
        days_since_last_query_for_summoner = days_since_last_request_for_summoner(puuid)
        if days_since_last_query_for_summoner is not None and days_since_last_query_for_summoner < 30:
            print('Skipping games for {} since we last grabbed their data {:.2f} days ago' \
                .format(summoner, days_since_last_query_for_summoner))
            continue

        # Upsert the summoner to the DB
        add_summoner(puuid)

        print('Grabbing games for {} (#{}), in {} {}'.format(summoner, count, division, tier))
        # Grab all their games
        match_ids = list(get_all_match_ids_for_puuid(puuid, QueueType.Ranked5v5, None, region))

        # Write out how many games we're pulling, how many are unique
        lmi = len(match_ids)

        # If we failed to grab any games, then quit early
        if lmi == 0:
            print("Couldn't find any games for {}".format(summoner))
            continue

        new_match_ids = get_match_ids_not_yet_in_database(match_ids)
        lnmi = len(new_match_ids)
        if lnmi < 1:
            print('No games to grab for {}, continuing'.format(summoner))
        else:
            print('{} games total, grabbing {} ({:.2f}% unique)'.format(lmi, lnmi, lnmi / lmi * 100))

        # Grab all the game data from riot's server, save to dictionary
        start = time.time()
        games = {}
        num_processes = 8

        with Pool(num_processes) as pool:
            for match_results in pool.imap_unordered(work, [(id, region) for id in new_match_ids], max(1, int(lnmi / num_processes))):
                if match_results is not None:
                    match_id, winners, losers, patch, queue = match_results
                    games[match_id] = {
                        'winners': winners,
                        'losers': losers,
                        'patch': patch,
                        'queue': queue
                    }

        # Add all the games to the database
        print('Adding {} games to the database after {:.1f} seconds of multiprocessing'.format(len(games), time.time() - start))
        add_games(games)
