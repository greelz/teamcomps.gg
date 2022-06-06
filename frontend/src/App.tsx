import React, { useState } from "react";
import "./App.css";
import Teamcomp from "./Teamcomp";
import * as f from "./FakeWebServer";
import { ChampionName, IChampionTableData } from "./Interfaces";
import UseFetchService from "./UseFetchService";
import RandomNumberJumbler from "./RandomNumberJumbler";
import ChampionsList from "./ChampionsList";
import { cursorTo } from "readline";

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
  const [winPercentage, setWinPercentage] = useState(50);
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
    const response = await (
      await fetch(`http://localhost:3010/api/getWinningPercentage?prod=${prod}&numChamps=${num}`)
    ).json();
    return response['winPercentage'];
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

    const newPercentage = await getNewWinningPercentage(copy);
    console.log(newPercentage);
    setWinPercentage(parseFloat(newPercentage));
    setRequestInProgress(false);
    setShowRandomNumbers(false);
  };

  if (championData) {
    return (
      <div className="_page">
        <RandomNumberJumbler
          minValue={10}
          maxValue={100}
          actualValue={winPercentage}
          jumble={showRandomNumbers}
        />
        <div className="_container">
          <Teamcomp champions={teamcomp} />
          <ChampionsList
            championData={championData}
            handleChampionClick={(champion: IChampionTableData) =>
              handleChampClick(champion)
            }
          />
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default App;
