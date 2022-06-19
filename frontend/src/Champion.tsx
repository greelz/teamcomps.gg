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
  require.context("./assets/champions/120x120", false, /\.(png)$/)
);

export interface ChampionProps extends IChampionTableData {
  clickHandler?: MouseEventHandler<HTMLDivElement>;
  onDragStart: (championName: IChampionTableData) => void;
}

export default function Champion(props: ChampionProps) {
  if (props.prettyname) {
    return (
      <div
        draggable
        onDragStart={() => props.onDragStart({...props})}
        onClick={props.clickHandler}
        className="_champion"
      >
        <img alt={props.prettyname} src={images[props.internalname + ".png"]} />
        <span>{props.prettyname}</span>
      </div>
    );
  } else {
    return <div className="_champion blank"></div>;
  }
}
