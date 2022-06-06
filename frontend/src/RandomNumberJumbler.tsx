import React, { useState, useEffect, useRef } from "react";

type Props = {
  minValue: number;
  maxValue: number;
  actualValue?: number;
  jumble: boolean;
};

const getRandInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export default function RandomNumberJumbler({
  minValue,
  maxValue,
  actualValue,
  jumble,
}: Props) {
  const [value, setValue] = useState(actualValue);
  const jumbleInterval = useRef<NodeJS.Timer>();

  useEffect(() => {
    // If we're asked to show random numbers, create an interval to do so
    if (jumble) {
      jumbleInterval.current = setInterval(() => {
        setValue(getRandInt(minValue, maxValue));
      }, 25);
    }

    else {
      setValue(actualValue);
      clearInterval(jumbleInterval.current);
    }
  }, [minValue, maxValue, actualValue, jumble]);

  return <div className="_winPercentage">{value}%</div>;
}
