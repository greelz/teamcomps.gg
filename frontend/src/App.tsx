import React, { useEffect, useRef, useState } from "react";
import "./css/styles.css";
import "./App.css";
import Teamcomp from "./Teamcomp";
import * as f from "./FakeWebServer";
import {
  IChampionTableData,
  IGetWinningPercentageResult,
  INextBestChamps,
  IScreenData,
} from "./Interfaces";
import UseFetchService from "./UseFetchService";
import RandomNumberJumbler from "./RandomNumberJumbler";
import ChampionsList from "./ChampionsList";

async function setTimeoutAsync(ms: number): Promise<void> {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });
}

const deepCopy = (existingMap: Map<any, any> | null | undefined) => {
  if (!existingMap) return new Map();
  return new Map(JSON.parse(JSON.stringify(Array.from(existingMap))));
};

const memoize = (fn: any) => {
  let cache: any = {};
  return (...args: any) => {
    let s = JSON.stringify(args);
    return s in cache ? cache[s] : (cache[s] = fn(...args));
  };
};

interface ICache {
  [x: string]: boolean
}

function App() {

  const cache = useRef<ICache>({});
  // State
  const [teamcomp, setTeamcomp] = useState<Array<IChampionTableData | null>>([
    null,
    null,
    null,
    null,
    null,
  ]);

  const currentTeampcompPrimeId = teamcomp.reduce((total, curr) => {
    return (curr?.primeid || 1) * total;
  }, 1);

  const [data, setData] = useState<Map<number, IScreenData | null>>();

  const currentWinPercentage = data?.get(
    currentTeampcompPrimeId
  )?.winPercentage;

  const currentNumGames = data?.get(currentTeampcompPrimeId)?.numGames;

  const currentNextBestChamps = data?.get(
    currentTeampcompPrimeId
  )?.nextBestChamps;

  // Data is a dictionary of primeId (of teamcomp) -> IScreenData
  const [showRandomNumbers, setShowRandomNumbers] = useState(false);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [dragChampion, setDragChampion] = useState<IChampionTableData | null>(
    null
  );

  const championData: IChampionTableData[] = UseFetchService({
    dataLoadAsyncCall: f.getChampionData,
  });

  // Main useEffect --> when teamcomp changes, set data for the entire screen
  useEffect(() => {
    const loadWinningPercentage = async (prod: number, num: number) => {
      if (cache.current[`${prod}perc`]) return;
      const req1 = await fetch(
        `http://localhost:3010/api/getWinningPercentage?prod=${prod}&numChamps=${num}`
      );
      const result: IGetWinningPercentageResult = await req1.json();
      setData((d: Map<number, IScreenData | null> | undefined) => {
        const x = deepCopy(d);
        if (!x) d = new Map<number, IScreenData | null>();
        x.set(prod, {
          numGames: result.games,
          winPercentage: result.winPercentage,
          nextBestChamps: x.get(prod)?.nextBestChamps,
        });
        cache.current[`${prod}perc`] = true;
        return x;
      });
    };

    const loadNextBestChamps = async (prod: number, num: number) => {
      if (cache.current[`${prod}bc`]) return;
      const req2 = await fetch(
        `http://localhost:3010/api/nextBestChamps?prod=${prod}&numChamps=${num}`
      );
      const result: INextBestChamps[] = await req2.json();
      setData((d: Map<number, IScreenData | null> | undefined) => {
        const x = deepCopy(d);
        x.set(prod, {
          nextBestChamps: result,
          numGames: x.get(prod)?.numGames,
          winPercentage: x.get(prod)?.winPercentage,
        });
        cache.current[`${prod}bc`] = true;
        return x;
      });
    };

    const prod = teamcomp.reduce((total, curr) => {
      return total * (curr?.primeid || 1);
    }, 1);

    if (prod > 1) {
      const num = teamcomp.filter((x) => x !== null).length;

      loadWinningPercentage(prod, num);
      loadNextBestChamps(prod, num);
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
              actualValue={currentWinPercentage}
              jumble={showRandomNumbers}
            />
            <span>({currentNumGames} games)</span>
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
              nextBestChampData={currentNextBestChamps}
              currentPercentage={currentWinPercentage}
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
