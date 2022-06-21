import React, { useEffect, useState } from "react";
import "./css/styles.css";
import "./App.css";
import Teamcomp from "./Teamcomp";
import * as f from "./FakeWebServer";
import { IChampionTableData } from "./Interfaces";
import UseFetchService from "./UseFetchService";
import RandomNumberJumbler from "./RandomNumberJumbler";
import ChampionsList, { IChampionListChamp } from "./ChampionsList";
import { loadavg } from "os";

async function setTimeoutAsync(ms: number): Promise<void> {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });
}

function App() {
  // State
  const [teamcomp, setTeamcomp] = useState<Array<IChampionTableData | null>>([
    null,
    null,
    null,
    null,
    null,
  ]);

  const [showRandomNumbers, setShowRandomNumbers] = useState(false);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [winPercentage, setWinPercentage] = useState<number>(50.0);
  const [numGames, setNumGames] = useState(0);
  const [dragChampion, setDragChampion] = useState<IChampionTableData | null>(
    null
  );
  const [championData, setChampionData] = useState<
    IChampionListChamp[] | null
  >();

  useEffect(() => {
    const load = async () => {
      setChampionData(await f.getChampionData());
    };
    load();
  }, []);

  useEffect(() => {
    const getNewWinningPercentage = async (
      comp: (IChampionTableData | null)[]
    ): Promise<void> => {
      let prod = 1;
      let num = 0;
      for (const champ of comp) {
        if (champ) {
          prod *= champ.primeid || 1;
          num += 1;
        }
      }
      const startMs = new Date().getTime();
      const req1 = await fetch(
        `http://localhost:3010/api/getWinningPercentage?prod=${prod}&numChamps=${num}`
      );
      const req2 = await fetch(
        `http://localhost:3010/api/nextBestChamps?prod=${prod}&numChamps=${num}`
      );

      const now = new Date().getTime();
      const minDelay = 500;
      interface IFirstResult {
        winPercentage: number;
        games: number;
      }

      interface ISecondResult {
        wp: number;
        nc: number;
      }

      try {
        const results: [IFirstResult, ISecondResult[]] = await Promise.all([
          req1.json(),
          req2.json(),
        ]);
        if (now - startMs < minDelay) {
          await setTimeoutAsync(minDelay - (now - startMs));
        }

        console.log(results);
        setWinPercentage(results[0]["winPercentage"]);
        setNumGames(results[0]["games"]);

        setChampionData((cd) => {
          let copy = [...cd!];
          for (let f of copy) {
            let filt = results[1].filter((x) => x.nc === f.primeid);
            if (filt.length === 1) {
              f.relativePercent = filt[0].wp;
            }
            else {
              f.relativePercent = undefined;
            }
          }
          return copy;
        });
      } catch (e) {
        console.log(e);
      } finally {
        setRequestInProgress(false);
        setShowRandomNumbers(false);
      }
    };

    if (teamcomp.every((val) => val === null)) {
      setNumGames(0);
      setWinPercentage(50);
    } else {
      setShowRandomNumbers(true);
      setRequestInProgress(true);
      // This is an async function call
      getNewWinningPercentage(teamcomp);
    }
  }, [teamcomp]);

  // Handlers
  async function handleChampClick(
    champion?: IChampionTableData,
    xIndex?: number
  ) {
    if (requestInProgress) return;
    if (champion && teamcomp.indexOf(null) === -1) return;

    let copy = [...teamcomp];

    if (champion && copy.indexOf(champion) === -1 && copy.indexOf(null) > -1) {
      // Make sure there's a spot to fill
      // Find the spot to put this champion
      const laneAssignments = [
        champion.toplaner,
        champion.jungler,
        champion.midlaner,
        champion.adc,
        champion.support,
      ];
      let locationToInsert = null,
        index = 0;
      while (locationToInsert === null && index < 5) {
        if (laneAssignments[index] === true && copy[index] === null) {
          locationToInsert = index;
        }
        index += 1;
      }

      if (locationToInsert === null) {
        locationToInsert = copy.indexOf(null);
      }

      copy[locationToInsert] = champion;
      setTeamcomp(copy);
    } else if (xIndex != null && xIndex > -1 && xIndex < 5) {
      copy[xIndex] = null;
      setTeamcomp(copy);
    }
  }

  if (championData) {
    return (
      <div className="_root">
        <header>Teamcomps.gg</header>
        <div className="_page clr-primary-380">
          <div className="_winPercentContainer">
            <RandomNumberJumbler
              minValue={10}
              maxValue={100}
              actualValue={winPercentage}
              jumble={showRandomNumbers}
            />
            <span>({numGames} games)</span>
          </div>
          <div className="_container">
            <Teamcomp
              onDragStart={(c) => setDragChampion(c)}
              champions={teamcomp}
              onClickX={(i: number) => {
                handleChampClick(undefined, i);
              }}
              onDrop={(i) => {
                if (dragChampion) {
                  const inExistingComp = teamcomp.findIndex(
                    (t) => t?.internalname === dragChampion.internalname
                  );
                  if (inExistingComp === -1) {
                    // Not in the existing comp, let the drop go
                    const copy = [...teamcomp];
                    copy[i] = dragChampion;
                    setTeamcomp(copy);
                  } else if (inExistingComp !== i) {
                    // In the existing comp somwhere else, so remove it and move it to drop spot
                    const copy = [...teamcomp];
                    const temp = copy[i];
                    copy[i] = dragChampion;
                    copy[inExistingComp] = temp;
                    setTeamcomp(copy);
                  }
                }
              }}
              onClickReset={() => setTeamcomp([null, null, null, null, null])}
            />
            <ChampionsList
              championData={championData}
              handleChampionClick={(champion: IChampionTableData) =>
                handleChampClick(champion)
              }
              onDragStart={(champion: IChampionTableData) => {
                setDragChampion(champion);
              }}
              currentPercentage={winPercentage}
            />
          </div>
        </div>
        <footer>Thanks for using teamcomps.gg.</footer>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default App;
