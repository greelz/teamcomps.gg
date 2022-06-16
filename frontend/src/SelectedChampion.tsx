import React from "react";
import { ChampionName } from "./Interfaces";

interface ISelectedChampionProps {
  name: ChampionName | undefined | null;
  description: string;
  role: string;
  onClickX: Function;
}

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

export default function SelectedChampion({
  name,
  description,
  role,
  onClickX
}: ISelectedChampionProps) {
  if (name) {
    return (
      <div className="_selectedChampion">
        <img alt={name} src={images[name + ".png"]} />
        <div className="_rightContent">
          <div className="_name">{name}</div>
          <div className="_description">{description}</div>
          <div className="_role">{role}</div>
        </div>
        <div onClick={() => onClickX()} className="_xButton">X</div>
      </div>
    );
  } else {
    return (
      <div className="_selectedChampion">
        <div className="_blank"></div>
        <div className="_rightContent"></div>
      </div>
    );
  }
}
