import express from 'express';
import cors from 'cors';
import { Client, QueryResult } from "pg";

interface IChampionTableData {
  id: number,
  primeid: number,
  internalname: string,
  prettyname: string,
  toplaner: boolean,
  midlaner: boolean,
  jungler: boolean,
  support: boolean,
  adc: boolean
}

const port = 3010;
const app = express();

app.use(cors());

const client = new Client({
  user: "postgres",
  database: "mydb",
  password: "password",
});

client.connect();


// Main route
app.get("/", (req, res) => {
  res.send("Hello Worlds!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/api/getWinningPercentage", async function (req, res) {
  let prod = req.query.prod;
  const numChamps = req.query.numChamps;

  if (!prod || !numChamps) return;

  const prodNum = parseInt(prod.toString());
  const num = parseInt(numChamps.toString());

  const result = await getWinningPercentage(prodNum, num);
  if (result) {
    res.send({
      winPercentage: (result * 100).toPrecision(3),
    });
  }
  else {
      res.send();
  }
});

app.get("/api/getChampList", async function (_request, res) {
    const response = await client.query<IChampionTableData>('SELECT * FROM CHAMPIONS ORDER BY prettyname ASC');
    res.send(response.rows);
});

function getWinningPercentage(product: number, numChamps: number): Promise<number> | undefined {
  if (numChamps < 1 || numChamps > 5) return;
  if (product < 3) return;
  const tableNames = ['singles', 'doubles', 'triples', 'quads', 'quints'];
  const tableName = tableNames[numChamps - 1];

  var query = {
    text: `SELECT CAST(wins as FLOAT) / (wins + losses) AS WinPct FROM ${tableName} WHERE primeid = $1`,
    values: [product],
  };

  return new Promise(function (resolve) {
    client
      .query(query)
      .then((res) => {
        console.log(query);
        if (res.rowCount > 0) {
          resolve(res.rows[0]["winpct"]);
          return;
        }
        else {
          resolve(-1);
        }
      })
      .catch((e) => console.error(e.stack));
  });
}