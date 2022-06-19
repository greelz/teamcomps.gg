import React, { useState } from "react";

interface IBlankSelectedChampionProps {
  onDrop: () => void;
  role: string;
}

export default function BlankSelectedChampion(props: IBlankSelectedChampionProps) {
  const { onDrop, role } = props;
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
    >
        <div className={`_blank ${role}`}></div>
      <div className="_rightContent"></div>
    </div>
  );
}
