import { useEffect, useState } from "react";
import { fetchData } from "../utils/api";

const useFetch = (endpoint) => {
  const [data, setData] = useState();
  useEffect(() => {
    makeApiCall();
  }, [endpoint]);

  const makeApiCall = async () => {
    const response = fetchData(endpoint);
    setData(response);
  };
  return { data };
};

export default useFetch;
