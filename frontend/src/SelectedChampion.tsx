import React, { useState } from "react";
import { IChampionTableData } from "./Interfaces";

interface ISelectedChampionProps extends IChampionTableData {
  onClickX: () => void;
  onDrop: () => void;
  onDragStart: (champion: IChampionTableData) => void;
  role: string;
}

function importAll(r: __WebpackModuleApi.RequireContext) {
  let imagesDictionary: { [name: string]: string } = {};
  r.keys().forEach((filename) => {
    imagesDictionary[filename.substring(2)] = r(filename);
  });
  return imagesDictionary;
}

const championImages = importAll(
  require.context("./assets/champions", false, /\.(png)$/)
);

export default function SelectedChampion(props: ISelectedChampionProps) {
  const { onDragStart, onDrop, role, onClickX } = props;
  const [draggedOver, setDraggedOver] = useState(false);
  return (
    <div
      className={`_selectedChampion ${draggedOver ? "_draggedOver" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDraggedOver(true);
      }}
      onDragLeave={(e) => {
        setDraggedOver(false);
      }}
      onDrop={() => {
        setDraggedOver(false);
        onDrop();
      }}
      onDragStart={() => onDragStart({ ...props })}
      draggable
    >
      {props.internalname ? (
        <img
          alt={props.internalname}
          src={championImages[props.internalname + ".png"]}
        />
      ) : (
        <div className={`_blank ${role}`}></div>
      )}
      <div className="_rightContent">
        <div className="_name">{props.prettyname}</div>
        <div className="_description">{props.title}</div>
      </div>
      <input type="button" onClick={() => onClickX()} className="icon icon-x" />
    </div>
  );
}
