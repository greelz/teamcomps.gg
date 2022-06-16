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
  name: string,
  internalName: string,
  clickHandler?: MouseEventHandler<HTMLDivElement>,
}

export default function Champion(props: ChampionProps) {
  if (props.name) {
    return (
      <div onClick={props.clickHandler} className="_champion">
        <img alt={props.name} src={images[props.internalName + ".png"]} />
        <span>{props.name}</span>
      </div>
    );
  } else {
    return <div className="_champion blank"></div>
  }
}
