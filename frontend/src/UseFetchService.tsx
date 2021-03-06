import { useEffect, useState } from "react";

type Props = {
  initialState?: object;
  dataLoadAsyncCall: Function;
};

export default function UseFetchService<T>({
  initialState,
  dataLoadAsyncCall,
}: Props) {
  const [data, setData] = useState(initialState);

  useEffect(() => {
    const loadFunc = async() => {
      const dataLoadResponse = await dataLoadAsyncCall();
      setData(dataLoadResponse);
    };

    loadFunc();

  }, [dataLoadAsyncCall]);

  return data as unknown as T;
}
