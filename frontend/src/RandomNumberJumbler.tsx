import React, { useState, useEffect, useRef } from "react";

type Props = {
  minValue: number;
  maxValue: number;
  actualValue?: number | string;
  jumble: boolean;
  className: string;
};

const getRandInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export default function RandomNumberJumbler({
  minValue,
  maxValue,
  actualValue,
  jumble,
  className,
}: Props) {
  const [value, setValue] = useState(actualValue);
  const jumbleInterval = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (jumble) {
      jumbleInterval.current = setInterval(() => {
        setValue(getRandInt(minValue, maxValue));
      }, 25);
    }
    else {
      setValue(actualValue);
    }

    return () => {
      clearInterval(jumbleInterval.current);
    };
  }, [minValue, maxValue, jumble, actualValue]);

  return <div className={className}>{value}</div>;
}
