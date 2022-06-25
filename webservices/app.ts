import express, { response } from "express";
import cors from "cors";
import { Client } from "pg";
import { performance } from 'perf_hooks';

interface IChampionTableData {
  id: number;
  primeid: number;
  internalname: string;
  prettyname: string;
  toplaner: boolean;
  midlaner: boolean;
  jungler: boolean;
  support: boolean;
  adc: boolean;
  title: string;
  popularity: number;
}

const port = 3010;
const app = express();
const bunchOfPrimes = generatePrimes(100000);

app.use(cors());

const client = new Client({
  user: "postgres",
  database: "mydb",
  password: "password",
});

client.connect();

app.listen(port, () => {
  console.log(`Teamcomps.gg running on port ${port}`);
});

//#region Routes
// Main route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/getWinningPercentage", async function (req, res) {
  let prod = parseInt(req.query.prod as string);
  const numChamps = parseInt(req.query.numChamps as string);

  if (!prod || !numChamps) return;


  const result = await getWinningPercentage(prod, numChamps);

  if (result) {
    res.send({
      winPercentage: (result[0] * 100).toPrecision(3),
      games: result[1],
    });
  } else {
    res.send({winPercentage: 0, games: 0});
  }
});

app.get("/api/getChampList", async function (_request, res) {
  const response = await client.query<IChampionTableData>(
    "SELECT * FROM CHAMPIONS ORDER BY prettyname ASC"
  );
  res.send(response.rows);
});

app.get("/api/nextBestChamps", async function (req, res) {
  const prod = parseInt(req.query.prod as string);
  const numChamps = parseInt(req.query.numChamps as string);

  // Check that prod is a number
  if (!prod || !numChamps) {
    res.send({});
    return;
  }

  if (numChamps < 1 || numChamps > 4) {
    res.send({});
    return;
  }

  const dbToQuery = ["doubles", "triples", "quads", "quints"][numChamps - 1];
  const query = {
    text:
      "SELECT CAST(wins * 100 as float) / (wins + losses) as winpercentage, CAST(primeid / $1 as integer) as primeid, (wins + losses) as numgames " +
      `FROM ${dbToQuery} ` +
      "WHERE primeid % $1 = 0 AND (wins + losses) > 30",
    values: [prod],
  };

  let answer = {};

  try {
    const result = await client.query(query);
    answer = result.rows;
  } catch (e: any) {
    console.error(e.stack);
  } finally {
    res.send(answer);
  }
});
//#endregion

//#region Helpers

async function getWinningPercentage(
  product: number,
  numChamps: number
): Promise<[number, number] | undefined> {
  if (numChamps < 1 || numChamps > 5) return;
  if (product < 3) return;
  const tableNames = ["singles", "doubles", "triples", "quads", "quints"];
  const tableName = tableNames[numChamps - 1];

  var query = {
    text: `SELECT wins + losses as numGames, CAST(wins as FLOAT) / (wins + losses) AS WinPct ` +
          `FROM ${tableName} ` +
          'WHERE primeid = $1',
    values: [product],
  };

  let response: [number, number] | undefined = undefined;
  try {
    const result = await client.query(query);
    if (result.rowCount === 1) {
      response = [result.rows[0]['winpct'], result.rows[0]['numgames']];
    }
  } catch(e: any) {
    console.error(e.stack);
  }
  finally {
    return response;
  }
}

// Generates a list of primes up to a certain number that you select
function generatePrimes(upToNum: number): number[] {
  let primes = [2];
  for (let i = 3; i < upToNum; i += 2) {
    let isPrime = true;
    for (let j = 3; j < Math.floor(Math.sqrt(i)) + 1; j += 2) {
      if (i % j === 0) {
        // i is not prime
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      primes.push(i);
    }
  }

  return primes;
}

function primeFactorization(num: number): number[] {
  const start = performance.now();
  let currNum = num;
  let factors = [];
  while (!bunchOfPrimes.includes(currNum)) {
    for (let x of bunchOfPrimes) {
      if (currNum % x === 0) {
        currNum = currNum / x;
        factors.push(x);
        break;
      }
    }
  }
  factors.push(currNum);
  console.log(`It took ${performance.now() - start}ms to factorize ${num}.`);
  return factors;
}

//#endregion
