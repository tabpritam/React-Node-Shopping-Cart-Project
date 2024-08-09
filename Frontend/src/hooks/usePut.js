import { useState } from "react";
import { putData } from "../utils/api";

const usePost = (endpoint, putDataPayload) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  //   useEffect(() => {
  //     if (postDataPayload) {
  //       makeApiCall();
  //     }
  //   }, [endpoint, postDataPayload]);

  const makeApiCall = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await putData(endpoint, putDataPayload);
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  return { data, error, loading, makeApiCall };
};

export default usePost;
