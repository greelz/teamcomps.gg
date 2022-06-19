import json
import time
from typing import Iterator, Union
import requests
from helpers.api_classes import *
from helpers.secrets import riot_api_key

# Don't commit this key to github, make it a private variable on github
rate_limit_10_seconds = 500
rate_limit_10_minutes = 30000 # this is the same as the 10 second limit but maybe it'll change someday?
timer_start = 0
requests_in_last_minute = 0

#region League-V4 
# Top 300 players
def _get_challenger_leagues(queue: Queue, region: Region = Region.NorthAmerica) -> Iterator[LeagueItemDto]:
    url = '/lol/league/v4/challengerleagues/by-queue/{queue}'.format(queue = queue.name)
    try:
        response = json.loads(__do_riot_request(url, None, region.value[0]).content)
    except AttributeError:
        yield []
    else:
        for entry in response['entries']:
            yield LeagueItemDto(**entry)


# 301-1000 best players
def _get_grandmaster_leagues(queue: Queue, region: Region = Region.NorthAmerica) -> Iterator[LeagueItemDto]:
    url = '/lol/league/v4/grandmasterleagues/by-queue/{queue}'.format(queue = queue.name)
    try:
        response = json.loads(__do_riot_request(url, None, region.value[0]).content)
    except AttributeError:
        yield []
    else:
        for entry in response['entries']:
            yield LeagueItemDto(**entry)

# 1001-~4500 best players
def _get_master_leagues(queue: Queue, region: Region = Region.NorthAmerica) -> Iterator[LeagueItemDto]:
    url = '/lol/league/v4/masterleagues/by-queue/{queue}'.format(queue = queue.name)
    try:
        response = json.loads(__do_riot_request(url, None, region.value[0]).content)
    except AttributeError:
        yield []
    else:
        for entry in response['entries']:
            yield LeagueItemDto(**entry)

def get_all_players_in_division(queue: Queue, tier: Tier, division: Division, region: Region = Region.NorthAmerica) -> Iterator[LeagueEntryDto]:
    url = '/lol/league/v4/entries/{queue}/{division}/{tier}'.format(queue = queue.name, tier = tier.name, division = division.name)
    keep_going = True
    page = 1
    while keep_going:
        try:
            response = json.loads(__do_riot_request(url, [('page', str(page))], region.value[0]).content)
        except AttributeError:
            yield []
        else:
            page += 1
            if response is None or len(response) == 0:
                return
            else:
                for entry in response:
                    yield LeagueEntryDto(**entry)



def _get_players_in_division(queue: Queue, tier: Tier, division: Division, page: int, region: Region = Region.NorthAmerica) -> Iterator[LeagueEntryDto]:
    url = '/lol/league/v4/entries/{queue}/{division}/{tier}'.format(queue = queue.name, tier = tier.name, division = division.name)
    try:
        response = json.loads(__do_riot_request(url, [('page', str(page))], region.value[0]).content)
    except AttributeError:
        yield []
    else:
        for entry in response:
            yield LeagueEntryDto(**entry)

#endregion

#region Summoner-V4
def _get_puuid_by_name(summoner_name: str, region: Region = Region.NorthAmerica) -> Union[str, None]:
    name = get_summoner_info_by_name(summoner_name, region)
    if name is not None:
        return name.puuid
    return None

def get_summoner_info_by_name(summoner_name, region: Region = Region.NorthAmerica) -> SummonerDto:
    url = '/lol/summoner/v4/summoners/by-name/{summonerName}'.format(summonerName = summoner_name)
    response = __do_riot_request(url, None, region.value[0])
    if response is not None and response.status_code == 200:
        return SummonerDto(**json.loads(response.content))
    else:
        print("Error getting summoner {}".format(summoner_name))
        return None

def _get_summoner_by_account_id(encrypted_account_id, region: Region = Region.NorthAmerica) -> SummonerDto:
    url = '/lol/summoner/v4/summoners/by-account/{encryptedAccountId}'.format(encryptedAccountId = encrypted_account_id)
    try:
        response = json.loads(__do_riot_request(url, None, region.value[0]).content)
    except AttributeError:
        return None
    else:
        return SummonerDto(**response)

def _get_summoner_by_puuid(encrypted_puuid, region: Region = Region.NorthAmerica) -> SummonerDto:
    url = '/lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}'.format(encryptedPUUID = encrypted_puuid)
    try:
        response = json.loads(__do_riot_request(url, None, region.value[0]).content)
    except AttributeError:
        return None
    else:
        return SummonerDto(**response)

def _get_summoner_by_summoner_id(encrypted_summoner_id, region: Region = Region.NorthAmerica) -> SummonerDto:
    url = '/lol/summoner/v4/summoners/{encryptedSummonerId}'.format(encryptedSummonerId = encrypted_summoner_id)
    try:
        response = json.loads(__do_riot_request(url, None, region.value[0]).content)
    except AttributeError:
        return None
    else:
        return SummonerDto(**response)

#endregion

#region Champion-Mastery-V4
def _get_champion_mastery(encrypted_summoner_id, region: Region = Region.NorthAmerica) -> ChampionMasteryDto:
    url = '/lol/champion-mastery/v4/champion-masteries/by-summoner/{encryptedSummonerId}'.format(encryptedSummonerId = encrypted_summoner_id)
    response = json.loads(__do_riot_request(url, None, region.value[0]).content)
    return ChampionMasteryDto(**response)

def _get_total_champion_mastery(encrypted_summoner_id, region: Region = Region.NorthAmerica) -> int:
    url = '/lol/champion-mastery/v4/scores/by-summoner/{encryptedSummonerId}'.format(encryptedSummonerId = encrypted_summoner_id)
    return json.loads(__do_riot_request(url, None, region.value[0]).content)

#endregion

#region Match-V5
def _get_matches_by_puuid(puuid: str, start_game_index: int = 0, num_games: int = 100, 
    queue: QueueType = QueueType.Ranked5v5, start_time: float = None, region: Region = Region.NorthAmerica) -> list[str]:
    url = '/lol/match/v5/matches/by-puuid/{puuid}/ids'.format(puuid = puuid)
    query_args = [('start', str(start_game_index)), ('count', str(num_games)), ('queue', queue.value)]
    if start_time is not None:
        query_args.append(('startTime', start_time))
    response = __do_riot_request(url, query_args, region.value[1])
    if response is not None and response.status_code == 200:
        return json.loads(response.content)
    else:
        print("Error getting matches by puuid {}, {}, {}".format(puuid, start_game_index, num_games))

def _get_match(match_id, region: Region) -> MatchDto:
    url = '/lol/match/v5/matches/{matchId}'.format(matchId = match_id)
    try:
        response = json.loads(__do_riot_request(url, None, region.value[1]).content)
    except AttributeError:
        return None
    else:
        if 'metadata' in response and 'info' in response:
            metadata = response['metadata']
            info = response['info']
            return MatchDto(metadata, info)
        return None

#endregion

#region Core Request

def __do_riot_request(url: str, query_parameters: list[tuple] = None, url_start = 'https://na1.api.riotgames.com') -> requests.Response:
    headers = { 
        'X-Riot-Token': riot_api_key
    }

    if url.endswith("/"):
        url = url[:-1]

    if not url.startswith('/'):
        url = '/' + url

    if query_parameters is not None:
        url += '?'
        for query_args in query_parameters:
            url += str(query_args[0]) + "=" + str(query_args[1]) + "&"
        url = url[:-1]

    try:
        req_url = url_start + url
        response = requests.get(req_url, headers = headers)
        if response.status_code == 429:
            print('Rate limit exceeded. Sleeping for 2 mins.')
            time.sleep(2 * 60)
        return response
    except requests.exceptions.ConnectionError as e:
        print('Error handling {}\n{}'.format(req_url, e))
        return None
#endregion

#region Public APIs

def get_all_games_for_puuid(puuid: str, queue_type: QueueType = QueueType.Ranked5v5, start_time: float = None, region: Region = Region.NorthAmerica):
    current_game_idx = 0
    num_games_at_a_time = 100
    keep_going = True
    while keep_going:
        next_index = current_game_idx + num_games_at_a_time
        match_list = _get_matches_by_puuid(puuid, current_game_idx, next_index - current_game_idx, queue_type, start_time, region)
        current_game_idx = next_index
        if match_list is None or len(match_list) == 0:
            keep_going = False
            break
        else:
            for match in match_list:
                yield _get_match(match, region)

def get_all_match_ids_for_puuid(puuid: str, queue_type: QueueType = QueueType.Ranked5v5, start_time: float = None, region: Region = Region.NorthAmerica):
    current_game_idx = 0
    num_games_at_a_time = 100
    keep_going = True
    while keep_going:
        next_index = current_game_idx + num_games_at_a_time
        match_list = _get_matches_by_puuid(puuid, current_game_idx, next_index - current_game_idx, queue_type, start_time, region)
        current_game_idx = next_index
        if match_list is None or len(match_list) == 0:
            keep_going = False
            break
        else:
            for match in match_list:
                yield match

def get_all_games_for_summoner(summoner_name: str, queue_type: QueueType = QueueType.Ranked5v5, start_time: float = None, region: Region = Region.NorthAmerica):
    puuid = _get_puuid_by_name(summoner_name, region)
    if puuid is not None:
        for game in get_all_games_for_puuid(puuid, queue_type, start_time, region):
            yield game
    yield []

def get_latest_n_games_for_summoner(summoner_name: str, num_games: int, queue_type: QueueType = QueueType.Ranked5v5, region: Region = Region.NorthAmerica) -> Iterator[MatchDto]:
    current_game_idx = 0
    num_games_at_a_time = 100
    puuid = _get_puuid_by_name(summoner_name, region)
    if puuid is None:
        return []
    stop = False
    while current_game_idx < num_games and not stop:
        next_index = min(num_games, current_game_idx + num_games_at_a_time)
        match_list = _get_matches_by_puuid(puuid, current_game_idx, next_index - current_game_idx, queue_type, region)
        current_game_idx = next_index
        if match_list is None or len(match_list) == 0:
            stop = True
        else:
            for match in match_list:
                yield _get_match(match, region)

def get_match_results(match: MatchDto):
    if match is None or match.info is None or match.info.participants is None:
        return

    winners = []
    losers = []
    patch = '.'.join(match.info.gameVersion.split('.')[:2]) # Only use one decimal's worth
    match_id = match.metadata.matchId
    try:
        queue = QueueType(match.info.queueId)
    except Exception as e:
        print(e)
        return
    else:
        for p in match.info.participants:
            if p.win:
                winners.append(p.championName)
            else:
                losers.append(p.championName)

        return [match_id, winners, losers, patch, queue]
