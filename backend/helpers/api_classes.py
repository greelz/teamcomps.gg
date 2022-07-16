from enum import Enum

class MatchDto():
    def __init__(self, metadata, info):
        self.metadata: MetadataDto = MetadataDto(**metadata)
        self.info: InfoDto = InfoDto(**info)

class ParticipantDto():
    def __init__(self,assists,baronKills,bountyLevel,champExperience,champLevel,championId,championName,championTransform,consumablesPurchased,
                    damageDealtToBuildings,damageDealtToObjectives,damageDealtToTurrets,damageSelfMitigated,deaths,detectorWardsPlaced,doubleKills,
                    dragonKills,firstBloodAssist,firstBloodKill,firstTowerAssist,firstTowerKill,gameEndedInEarlySurrender,gameEndedInSurrender,goldEarned,
                    goldSpent,individualPosition,inhibitorKills,inhibitorTakedowns,inhibitorsLost,item0,item1,item2,item3,item4,item5,item6,
                    itemsPurchased,killingSprees,kills,lane,largestCriticalStrike,largestKillingSpree,largestMultiKill,longestTimeSpentLiving,
                    magicDamageDealt,magicDamageDealtToChampions,magicDamageTaken,neutralMinionsKilled,nexusKills,nexusTakedowns,nexusLost,objectivesStolen,
                    objectivesStolenAssists,participantId,pentaKills,perks,physicalDamageDealt,physicalDamageDealtToChampions,physicalDamageTaken,
                    profileIcon,puuid,quadraKills,riotIdName,riotIdTagline,role,sightWardsBoughtInGame,spell1Casts,spell2Casts,spell3Casts,spell4Casts,
                    summoner1Casts,summoner1Id,summoner2Casts,summoner2Id,summonerId,summonerLevel,summonerName,teamEarlySurrendered,teamId,teamPosition,
                    timeCCingOthers,timePlayed,totalDamageDealt,totalDamageDealtToChampions,totalDamageShieldedOnTeammates,totalDamageTaken,totalHeal,
                    totalHealsOnTeammates,totalMinionsKilled,totalTimeCCDealt,totalTimeSpentDead,totalUnitsHealed,tripleKills,trueDamageDealt,
                    trueDamageDealtToChampions,trueDamageTaken,turretKills,turretTakedowns,turretsLost,unrealKills,visionScore,visionWardsBoughtInGame,
                    wardsKilled,wardsPlaced,win,challenges=None,eligibleForProgression=None,basicPings=None):
        self.assists = assists
        self.baronKills = baronKills
        self.basicPings = basicPings
        self.bountyLevel = bountyLevel
        self.challenges = challenges
        self.champExperience = champExperience
        self.champLevel = champLevel
        self.championId = championId
        self.championName = championName
        self.championTransform = championTransform
        self.consumablesPurchased = consumablesPurchased
        self.damageDealtToBuildings = damageDealtToBuildings
        self.damageDealtToObjectives = damageDealtToObjectives
        self.damageDealtToTurrets = damageDealtToTurrets
        self.damageSelfMitigated = damageSelfMitigated
        self.deaths = deaths
        self.detectorWardsPlaced = detectorWardsPlaced
        self.doubleKills = doubleKills
        self.dragonKills = dragonKills
        self.eligibleForProgression = eligibleForProgression
        self.firstBloodAssist = firstBloodAssist
        self.firstBloodKill = firstBloodKill
        self.firstTowerAssist = firstTowerAssist
        self.firstTowerKill = firstTowerKill
        self.gameEndedInEarlySurrender = gameEndedInEarlySurrender
        self.gameEndedInSurrender = gameEndedInSurrender
        self.goldEarned = goldEarned
        self.goldSpent = goldSpent
        self.individualPosition = individualPosition
        self.inhibitorKills = inhibitorKills
        self.inhibitorTakedowns = inhibitorTakedowns
        self.inhibitorsLost = inhibitorsLost
        self.item0 = item0
        self.item1 = item1
        self.item2 = item2
        self.item3 = item3
        self.item4 = item4
        self.item5 = item5
        self.item6 = item6
        self.itemsPurchased = itemsPurchased
        self.killingSprees = killingSprees
        self.kills = kills
        self.lane = lane
        self.largestCriticalStrike = largestCriticalStrike
        self.largestKillingSpree = largestKillingSpree
        self.largestMultiKill = largestMultiKill
        self.longestTimeSpentLiving = longestTimeSpentLiving
        self.magicDamageDealt = magicDamageDealt
        self.magicDamageDealtToChampions = magicDamageDealtToChampions
        self.magicDamageTaken = magicDamageTaken
        self.neutralMinionsKilled = neutralMinionsKilled
        self.nexusKills = nexusKills
        self.nexusTakedowns = nexusTakedowns
        self.nexusLost = nexusLost
        self.objectivesStolen = objectivesStolen
        self.objectivesStolenAssists = objectivesStolenAssists
        self.participantId = participantId
        self.pentaKills = pentaKills
        self.perks = perks
        self.physicalDamageDealt = physicalDamageDealt
        self.physicalDamageDealtToChampions = physicalDamageDealtToChampions
        self.physicalDamageTaken = physicalDamageTaken
        self.profileIcon = profileIcon
        self.puuid = puuid
        self.quadraKills = quadraKills
        self.riotIdName = riotIdName
        self.riotIdTagline = riotIdTagline
        self.role = role
        self.sightWardsBoughtInGame = sightWardsBoughtInGame
        self.spell1Casts = spell1Casts
        self.spell2Casts = spell2Casts
        self.spell3Casts = spell3Casts
        self.spell4Casts = spell4Casts
        self.summoner1Casts = summoner1Casts
        self.summoner1Id = summoner1Id
        self.summoner2Casts = summoner2Casts
        self.summoner2Id = summoner2Id
        self.summonerId = summonerId
        self.summonerLevel = summonerLevel
        self.summonerName = summonerName
        self.teamEarlySurrendered = teamEarlySurrendered
        self.teamId = teamId
        self.teamPosition = teamPosition
        self.timeCCingOthers = timeCCingOthers
        self.timePlayed = timePlayed
        self.totalDamageDealt = totalDamageDealt
        self.totalDamageDealtToChampions = totalDamageDealtToChampions
        self.totalDamageShieldedOnTeammates = totalDamageShieldedOnTeammates
        self.totalDamageTaken = totalDamageTaken
        self.totalHeal = totalHeal
        self.totalHealsOnTeammates = totalHealsOnTeammates
        self.totalMinionsKilled = totalMinionsKilled
        self.totalTimeCCDealt = totalTimeCCDealt
        self.totalTimeSpentDead = totalTimeSpentDead
        self.totalUnitsHealed = totalUnitsHealed
        self.tripleKills = tripleKills
        self.trueDamageDealt = trueDamageDealt
        self.trueDamageDealtToChampions = trueDamageDealtToChampions
        self.trueDamageTaken = trueDamageTaken
        self.turretKills = turretKills
        self.turretTakedowns = turretTakedowns
        self.turretsLost = turretsLost
        self.unrealKills = unrealKills
        self.visionScore = visionScore
        self.visionWardsBoughtInGame = visionWardsBoughtInGame
        self.wardsKilled = wardsKilled
        self.wardsPlaced = wardsPlaced
        self.win = win

class MetadataDto():
    def __init__(self, dataVersion, matchId, participants):
        self.dataVersion = dataVersion # Match data version (e.g., patch number, like 12.23)
        self.matchId = matchId
        self.participants = participants # A list of participant PUUIDs.

class TeamDto():
    def __init__(self, bans, objectives, teamId, win):
        self.bans = bans 
        self.objectives = objectives
        self.teamId = teamId # Integer
        self.win = win # boolean

class InfoDto():
    def __init__(self, gameCreation, gameDuration, gameId, gameMode, gameName, gameStartTimestamp, gameType, gameVersion,
                        mapId, participants, platformId, queueId, teams, gameEndTimestamp = None, tournamentCode = None):
        self.gameCreation = gameCreation # Unix timestamp for when the game is created on the game server (i.e., the loading screen).
        self.gameDuration = gameDuration # Prior to patch 11.20, this field returns the game length in milliseconds calculated from 
                                        # gameEndTimestamp - gameStartTimestamp. Post patch 11.20, this field returns the max timePlayed 
                                        # of any participant in the game in seconds, which makes the behavior of this field consistent with 
                                        # that of match-v4. The best way to handling the change in this field is to treat the value as milliseconds 
                                        # if the gameEndTimestamp field isn't in the response and to treat the value as seconds if gameEndTimestamp is in the response.

        self.gameEndTimestamp = gameEndTimestamp # Unix timestamp for when match ends on the game server. This timestamp can occasionally be 
                                                # significantly longer than when the match "ends". The most reliable way of determining the 
                                                # timestamp for the end of the match would be to add the max time played of any participant to the 
                                                # gameStartTimestamp. This field was added to match-v5 in patch 11.20 on Oct 5th, 2021.
        self.gameId = gameId
        self.gameMode = gameMode
        self.gameName = gameName
        self.gameStartTimestamp = gameStartTimestamp # Unix timestamp for when match starts on the game server.
        self.gameType = gameType
        self.gameVersion = gameVersion # The first two parts can be used to determine the patch a game was played on.
        self.mapId = mapId
        self.participants: list[ParticipantDto] = [ParticipantDto(**p) for p in participants] # List[ParticipantDto]
        self.platformId = platformId # Platform where the match was played.
        self.queueId: QueueType = queueId
        self.teams: list[TeamDto] = [TeamDto(**t) for t in teams] # List[TeamDto]
        self.tournamentCode = tournamentCode

class ChampionMasteryDto():
    def __init__(self, championPointsUntilNextLevel, chestGranted, championId, lastPlayTime,
                        championLevel, summonerId, championPoints, championPointsSinceLastLevel, tokensEarned):
        self.championPointsUntilNextLevel = championPointsUntilNextLevel # Number of points needed to achieve next level. Zero if player reached maximum champion level for this champion.
        self.chestGranted = chestGranted # Is chest granted for this champion or not in current season.
        self.championId = championId # Champion ID for this entry.
        self.lastPlayTime = lastPlayTime # 	Last time this champion was played by this player - in Unix milliseconds time format.
        self.championLevel = championLevel # Champion level for specified player and champion combination.
        self.summonerId = summonerId # Summoner ID for this entry. (Encrypted)
        self.championPoints = championPoints # Total number of champion points for this player and champion combination - they are used to determine championLevel.
        self.championPointsSinceLastLevel = championPointsSinceLastLevel # 	Number of points earned since current level has been achieved.
        self.tokensEarned = tokensEarned # 	The token earned for this champion at the current championLevel. When the championLevel is advanced the tokensEarned resets to 0.

class SummonerDto():
    def __init__(self, accountId, profileIconId, revisionDate, name, id, puuid, summonerLevel, status=None):
        self.accountId = accountId # Encrypted account ID. Max length 56 characters.
        self.profileIconId = profileIconId # ID of the summoner icon associated with the summoner.
        self.revisionDate = revisionDate # Date summoner was last modified specified as epoch milliseconds. The following events will update this timestamp: summoner name change, summoner level change, or profile icon change.
        self.name = name
        self.id = id # Encrypted summoner ID. Max length 63 characters.
        self.puuid = puuid # Encrypted PUUID. Exact length of 78 characters.
        self.summonerLevel = summonerLevel
        self.status = status

class LeagueItemDto():
    def __init__(self, summonerName, rank, summonerId, leaguePoints, wins, losses,
        hotStreak, veteran, freshBlood, inactive):
        self.summonerName = summonerName
        self.leaguePoints = leaguePoints
        self.rank = rank
        self.wins = wins
        self.losses = losses
        self.veteran = veteran
        self.inactive = inactive
        self.freshBlood = freshBlood
        self.hotStreak = hotStreak
        self.summonerId = summonerId

class LeagueEntryDto():
    def __init__(self, leagueId, summonerId, summonerName, queueType, tier, rank, leaguePoints, wins, losses,
        hotStreak, veteran, freshBlood, inactive, miniSeries = None):
        self.leagueId = leagueId
        self.summonerId = summonerId
        self.summonerName = summonerName
        self.queueType = queueType
        self.tier = tier
        self.rank = rank
        self.leaguePoints = leaguePoints
        self.wins = wins
        self.losses = losses
        self.hotStreak = hotStreak
        self.veteran = veteran
        self.freshBlood = freshBlood
        self.inactive = inactive
        self.miniSeries = miniSeries

class ChampionInfo():
    def __init__(self, attack, defense, magic, difficulty):
        self.attack = attack
        self.defense = defense
        self.magic = magic
        self.difficulty = difficulty

class ChampionImageInfo():
    def __init__(self, full, sprite, group, x, y, w, h):
        self.full = full
        self.sprite = sprite
        self.group = group,
        self.x = x
        self.y = y
        self.w = w
        self.h = h

class Champion():
    def __init__(self, version, id, key, name, title, blurb, info, image, tags, partype, stats):
        self.version: str = version
        self.id: str = id # this usually matches the name of the champion
        self.key: str = key # this is the unique champion id
        self.name: str = name
        self.title: str = title
        self.blurb: str = blurb
        self.info: ChampionInfo = info
        self.image: ChampionImageInfo = image
        self.tags: list[str] = tags
        self.partype: str = partype
        self.stats = stats

class QueueType(Enum):
    HEXAKILL6v6 = 75
    URF = 76
    Draft5v5 = 400
    Ranked5v5 = 420
    Blind5v5 = 430
    RankedFlex5v5 = 440
    Aram5v5 = 450
    Clash = 700
    ARURF = 900
    NexusSiege = 940
    NexusBlitz = 1300

class Queue(Enum):
    RANKED_SOLO_5x5 = "RANKED_SOLO_5x5"
    RANKED_FLEX_SR = "RANKED_FLEX_SR"
    RANKED_FLEX_TT = "RANKED_FLEX_TT"

class Tier(Enum):
    I = "I"
    II = "II"
    III = "III"
    IV = "IV"

class Division(Enum): 
    DIAMOND = "DIAMOND"
    PLATINUM = "PLATINUM"
    GOLD = "GOLD"
    SILVER = "SILVER"
    BRONZE = "BRONZE"
    IRON = "IRON"

class Region(Enum):
    EuNorth = ("https://eun1.api.riotgames.com", "https://europe.api.riotgames.com")
    Brazil = ("https://br1.api.riotgames.com", "https://americas.api.riotgames.com")
    EuWest = ("https://euw1.api.riotgames.com", "https://europe.api.riotgames.com")
    Japan = ("https://jp1.api.riotgames.com", "https://asia.api.riotgames.com")
    Korea = ("https://kr.api.riotgames.com", "https://asia.api.riotgames.com")
    Latinamerica = ("https://la1.api.riotgames.com", "https://americas.api.riotgames.com")
    Latinamerica2 = ("https://la2.api.riotgames.com", "https://americas.api.riotgames.com")
    NorthAmerica = ("https://na1.api.riotgames.com", "https://americas.api.riotgames.com")
    Oceania = ("https://oc1.api.riotgames.com", "https://asia.api.riotgames.com")
    Russia = ("https://ru.api.riotgames.com", "https://asia.api.riotgames.com")
    Turkey = ("https://tr1.api.riotgames.com", "https://asia.api.riotgames.com")