export interface ILeagueData {
  type: string;
  format: string;
  version: string;
  data: { [champion in ChampionName]: IChampionData }
}

export interface IChampionTableData {
  id: number,
  primeid: number,
  internalname: ChampionName,
  prettyname: string,
  toplaner: boolean,
  midlaner: boolean,
  jungler: boolean,
  support: boolean,
  adc: boolean,
  title: string,
  popularity: number // The lower the better
}

export interface IChampionData {
  version: string;
  id: string;
  primeId?: number;
  key: string;
  name: ChampionName;
  title: string;
  blurb: string;
  info: IChampionDataInfo;
  image: IChampionDataImage;
  tags: string[];
  partype: string;
  stats: IChampionDataStats;
}

interface IChampionDataInfo {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
}

enum ChampionTags {
    Mage = "Mage",
    Assassin = "Assassin",
    Marksman = "Marksman",
    Tank = "Tank",
    Support = "Support",
    Fighter = "Fighter",
}

export interface INextBestChamps {
  primeid: number;
  winpercentage: number;
  numgames: number;
}

export interface IScreenData {
  winPercentage?: number;
  numGames?: number;
  nextBestChamps?: INextBestChamps[];
}

export interface IGetWinningPercentageResult {
  winPercentage: number;
  games: number;
}


interface IChampionDataImage {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface IChampionDataStats {
  hp: number;
  hpperlevel: number;
  mp: number;
  mpperlevel: number;
  movespeed: number;
  armor: number;
  armorperlevel: number;
  spellblock: number;
  spellblockperlevel: number;
  attackrange: number;
  hpregen: number;
  hpregenperlevel: number;
  mpregen: number;
  mpregenperlevel: number;
  crit: number;
  critperlevel: number;
  attackdamage: number;
  attackdamageperlevel: number;
  attackspeedperlevel: number;
  attackspeed: number;
}

export enum ChampionName {
  Aatrox = "Aatrox",
  Ahri = "Ahri",
  Akali = "Akali",
  Akshan = "Akshan",
  Alistar = "Alistar",
  Amumu = "Amumu",
  Anivia = "Anivia",
  Annie = "Annie",
  Aphelios = "Aphelios",
  Ashe = "Ashe",
  AurelionSol = "AurelionSol",
  Azir = "Azir",
  Bard = "Bard",
  Blitzcrank = "Blitzcrank",
  Brand = "Brand",
  Braum = "Braum",
  Caitlyn = "Caitlyn",
  Camille = "Camille",
  Cassiopeia = "Cassiopeia",
  Chogath = "Chogath",
  Corki = "Corki",
  Darius = "Darius",
  Diana = "Diana",
  Draven = "Draven",
  DrMundo = "DrMundo",
  Ekko = "Ekko",
  Elise = "Elise",
  Evelynn = "Evelynn",
  Ezreal = "Ezreal",
  Fiddlesticks = "Fiddlesticks",
  Fiora = "Fiora",
  Fizz = "Fizz",
  Galio = "Galio",
  Gangplank = "Gangplank",
  Garen = "Garen",
  Gnar = "Gnar",
  Gragas = "Gragas",
  Graves = "Graves",
  Gwen = "Gwen",
  Hecarim = "Hecarim",
  Heimerdinger = "Heimerdinger",
  Illaoi = "Illaoi",
  Irelia = "Irelia",
  Ivern = "Ivern",
  Janna = "Janna",
  JarvanIV = "JarvanIV",
  Jax = "Jax",
  Jayce = "Jayce",
  Jhin = "Jhin",
  Jinx = "Jinx",
  Kaisa = "Kaisa",
  Kalista = "Kalista",
  Karma = "Karma",
  Karthus = "Karthus",
  Kassadin = "Kassadin",
  Katarina = "Katarina",
  Kayle = "Kayle",
  Kayn = "Kayn",
  Kennen = "Kennen",
  Khazix = "Khazix",
  Kindred = "Kindred",
  Kled = "Kled",
  KogMaw = "KogMaw",
  Leblanc = "Leblanc",
  LeeSin = "LeeSin",
  Leona = "Leona",
  Lillia = "Lillia",
  Lissandra = "Lissandra",
  Lucian = "Lucian",
  Lulu = "Lulu",
  Lux = "Lux",
  Malphite = "Malphite",
  Malzahar = "Malzahar",
  Maokai = "Maokai",
  MasterYi = "MasterYi",
  MissFortune = "MissFortune",
  MonkeyKing = "MonkeyKing",
  Mordekaiser = "Mordekaiser",
  Morgana = "Morgana",
  Nami = "Nami",
  Nasus = "Nasus",
  Nautilus = "Nautilus",
  Neeko = "Neeko",
  Nidalee = "Nidalee",
  Nocturne = "Nocturne",
  Nunu = "Nunu",
  Olaf = "Olaf",
  Orianna = "Orianna",
  Ornn = "Ornn",
  Pantheon = "Pantheon",
  Poppy = "Poppy",
  Pyke = "Pyke",
  Qiyana = "Qiyana",
  Quinn = "Quinn",
  Rakan = "Rakan",
  Rammus = "Rammus",
  RekSai = "RekSai",
  Rell = "Rell",
  Renata = "Renata",
  Renekton = "Renekton",
  Rengar = "Rengar",
  Riven = "Riven",
  Rumble = "Rumble",
  Ryze = "Ryze",
  Samira = "Samira",
  Sejuani = "Sejuani",
  Senna = "Senna",
  Seraphine = "Seraphine",
  Sett = "Sett",
  Shaco = "Shaco",
  Shen = "Shen",
  Shyvana = "Shyvana",
  Singed = "Singed",
  Sion = "Sion",
  Sivir = "Sivir",
  Skarner = "Skarner",
  Sona = "Sona",
  Soraka = "Soraka",
  Swain = "Swain",
  Sylas = "Sylas",
  Syndra = "Syndra",
  TahmKench = "TahmKench",
  Taliyah = "Taliyah",
  Talon = "Talon",
  Taric = "Taric",
  Teemo = "Teemo",
  Thresh = "Thresh",
  Tristana = "Tristana",
  Trundle = "Trundle",
  Tryndamere = "Tryndamere",
  TwistedFate = "TwistedFate",
  Twitch = "Twitch",
  Udyr = "Udyr",
  Urgot = "Urgot",
  Varus = "Varus",
  Vayne = "Vayne",
  Veigar = "Veigar",
  Velkoz = "Velkoz",
  Vex = "Vex",
  Vi = "Vi",
  Viego = "Viego",
  Viktor = "Viktor",
  Vladimir = "Vladimir",
  Volibear = "Volibear",
  Warwick = "Warwick",
  Xayah = "Xayah",
  Xerath = "Xerath",
  XinZhao = "XinZhao",
  Yasuo = "Yasuo",
  Yone = "Yone",
  Yorick = "Yorick",
  Yuumi = "Yuumi",
  Zac = "Zac",
  Zed = "Zed",
  Zeri = "Zeri",
  Ziggs = "Ziggs",
  Zilean = "Zilean",
  Zoe = "Zoe",
  Zyra = "Zyra",
}
