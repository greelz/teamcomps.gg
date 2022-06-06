import React from "react";
import { ChampionName } from "./Interfaces";
import "./SelectedChampion.css";

interface ISelectedChampionProps {
  name: ChampionName | undefined | null;
  description: string;
  role: string;
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
      </div>
    );
  } else {
    return (
      <div className="_selectedChampion _blank">
        <img alt="Empty placeholder"></img>
      </div>
    );
  }
}
