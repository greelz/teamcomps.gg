import React, { useState } from "react";
import "./css/styles.css";
import "./App.css";
import Teamcomp from "./Teamcomp";
import * as f from "./FakeWebServer";
import { IChampionTableData } from "./Interfaces";
import UseFetchService from "./UseFetchService";
import RandomNumberJumbler from "./RandomNumberJumbler";
import ChampionsList from "./ChampionsList";

async function setTimeoutAsync(ms: number): Promise<void> {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, ms);
  })
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
  const [locationToFill, setLocationToFill] = useState(0);
  const [winPercentage, setWinPercentage] = useState(0);
  const [numGames, setNumGames] = useState(0);
  const [showRandomNumbers, setShowRandomNumbers] = useState(false);
  const [requestInProgress, setRequestInProgress] = useState(false);

  // Initial fetches
  const championData: IChampionTableData[] = UseFetchService({
    dataLoadAsyncCall: f.getChampionData,
  }) as IChampionTableData[];

  const getNewWinningPercentage = async (
    comp: (IChampionTableData | null)[]
  ) => {
    let prod = 1;
    let num = 0;
    console.log(teamcomp);
    for (const champ of comp) {
      if (champ) {
        prod *= champ.primeid || 1;
        num += 1;
      }
    }
    const startMs = new Date().getTime();
    const response = await (
      await fetch(
        `http://localhost:3010/api/getWinningPercentage?prod=${prod}&numChamps=${num}`
      )
    ).json();

    const now = new Date().getTime();
    if (now - startMs < 500) {
      await setTimeoutAsync(500 - (now - startMs));
      return [response["winPercentage"], response["games"]];
    }
    else {
      return [response["winPercentage"], response["games"]];
    }
  };

  // Handlers
  const handleChampClick = async (champion: IChampionTableData) => {
    // Fill the array first, then start replacing from the beginning
    if (requestInProgress) return;
    if (teamcomp.indexOf(champion) > -1) return;
    setRequestInProgress(true);
    setShowRandomNumbers(true);

    const copy = [...teamcomp];
    copy[locationToFill] = champion;
    setTeamcomp(copy);
    setLocationToFill((locationToFill + 1) % 5);

    const [newPercentage, games] = await getNewWinningPercentage(copy);
    setWinPercentage(parseFloat(newPercentage));
    setNumGames(games);
    setRequestInProgress(false);
    setShowRandomNumbers(false);
  };

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
            <Teamcomp champions={teamcomp} onClickX={(i: number) => {
              const copy = [...teamcomp];
              copy[i] = null;
              setTeamcomp(copy);
            }} />
            <ChampionsList
              championData={championData}
              handleChampionClick={(champion: IChampionTableData) =>
                handleChampClick(champion)
              }
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
