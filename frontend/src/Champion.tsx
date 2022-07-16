import React, { MouseEventHandler } from "react";
import { IChampionTableData } from "./Interfaces";

function importAll(r: __WebpackModuleApi.RequireContext) {
  let imagesDictionary: { [name: string]: string } = {};
  r.keys().forEach((filename) => {
    imagesDictionary[filename.substring(2)] = r(filename);
  });
  return imagesDictionary;
}
const images = importAll(
  require.context("./assets/champions", false, /\.(png)$/)
);

export interface ChampionProps extends IChampionTableData {
  clickHandler?: MouseEventHandler<HTMLDivElement>;
  onDragStart: (championName: IChampionTableData) => void;
  currentPercentage?: number;
  nextWinningPercentage?: number
}

export default function Champion(props: ChampionProps) {
  let showPercent = false;
  let perc: number = 0;
  let spanClass = "";
  if (props.nextWinningPercentage && props.currentPercentage) {
    showPercent = true;
    perc = ((props.nextWinningPercentage - props.currentPercentage));
    if (perc <= -2) {
      spanClass = 'red';
    }
    else if (perc >= 2) {
      spanClass = 'green';
    }
  }

  if (props.prettyname) {
    return (
      <div
        draggable
        onDragStart={() => props.onDragStart({ ...props })}
        onClick={props.clickHandler}
        className="_champion"
      >
        <img alt={props.prettyname} src={images[props.internalname + ".png"]} />
        {showPercent ? (
          <>
          <span>{props.prettyname}</span>
          <span className={`small ${spanClass}`}>
            ({perc.toFixed(1) + "%"})
          </span>
          </>
        ) : (
          <span>{props.prettyname}</span>
        )}
      </div>
    );
  } else {
    return <div className="_champion blank"></div>;
  }
}
