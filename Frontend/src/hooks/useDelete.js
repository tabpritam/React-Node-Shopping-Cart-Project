import { useState } from "react";
import { deleteData } from "../utils/api";

const useDelete = (endpoint, postDataPayload) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const makeApiCall = async () => {
    setLoading(true);
    try {
      const response = await deleteData(endpoint, postDataPayload);
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  return { data, error, loading, makeApiCall };
};

export default useDelete;
