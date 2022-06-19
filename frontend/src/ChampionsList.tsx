import React, { ChangeEvent, useState } from "react";
import Champion from "./Champion";
import { ChampionName, IChampionTableData } from "./Interfaces";

interface IChampionsListProps {
  championData: IChampionTableData[];
  handleChampionClick: (champion: IChampionTableData) => void;
  onDragStart: (championName: IChampionTableData) => void,
}

export default function ChampionsList({
  championData,
  handleChampionClick,
  onDragStart,
}: IChampionsListProps) {

  function isInFilters(element: IChampionTableData): boolean {
    return isInTextFilter(element) && isInLaneFilter(element);
  }

  function isInLaneFilter(element: IChampionTableData): boolean {
    if (!laneFilter) return true;
    switch (laneFilter) {
      case "top":
        return element.toplaner;
      case "bot":
        return element.adc;
      case "jungle":
        return element.jungler;
      case "support":
        return element.support;
      case "mid":
        return element.midlaner;
      default:
        return false;
    }
  }

  function isInTextFilter(element: IChampionTableData): boolean {
    if (!textInFilter) return true;
    const tLower = textInFilter.toLowerCase();
    if (element.internalname.toLowerCase().includes(tLower)) return true;
    if (element.prettyname.toLowerCase().includes(tLower)) return true;
    return false;
  }

  function toggleLaneFilter(lane: string): void {
    if (lane === laneFilter) setLaneFilter(null);
    else {
      setLaneFilter(lane);
    }
  }

  function handleSortSelectionChange(e: ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === 'Name') setSortSelection(() => nameSort);
    else if (e.target.value === 'Popularity') setSortSelection(() => popularitySort);
  }

  const nameSort = (a: IChampionTableData, b: IChampionTableData): number => {
    if (a.prettyname > b.prettyname) return 1;
    else if (a.prettyname < b.prettyname) return -1;
    return 0;
  }

  const popularitySort = (a: IChampionTableData, b: IChampionTableData): number => {
    return a.popularity - b.popularity;
  }

  const [textInFilter, setTextInFilter] = useState<string>(
    ""
  );
  const [laneFilter, setLaneFilter] = useState<string | null>(null);
  const [sortSelection, setSortSelection] = useState<any>(() => nameSort); // default sort is name

  const filterButtons = ["top", "jungle", "mid", "bot", "support"];

  return (
    <div className="_championList">
      <div className="_filters">
        <div className="_roleFilters">
          {filterButtons.map((f) => {
            const selectedClass = laneFilter === f ? '_selected' : '';
            return (
              <input
                type="button"
                className={`icon icon-${f} ${selectedClass}`}
                onClick={() => toggleLaneFilter(f)}
                key={f}
              />
            );
          })}
        </div>
        <div className="_otherFilters">
          <input
            type="text"
            onChange={(e) => setTextInFilter(e.target.value)}
            value={textInFilter}
            autoFocus
            placeholder="Search"
          />
          <select onChange={(e) => handleSortSelectionChange(e)}>
            <option value="Name">Sort by name</option>
            <option value="Popularity">Sort by popularity</option>
          </select>
        </div>
      </div>
      <div className="_champions">
        {championData.sort(sortSelection).map((element) => {
          if (isInFilters(element)) {
            return (
              <Champion
              onDragStart={onDragStart}
                key={element.internalname}
                {...element}
                clickHandler={() => handleChampionClick(element)}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
