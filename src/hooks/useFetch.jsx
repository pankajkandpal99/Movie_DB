import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../utils/api";

// ye hook api.js se data lega aur uske main url ke peeche additional url add karke uss api.js component se data magega jisse wo api IMDB ke server se data fetch karke data object me save kar legi.
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading("loading...");
    setData(null);
    setError(null);

    fetchDataFromApi(url)
      .then((res) => {
        setLoading(false);
        setData(res);
      })
      .catch((err) => {
        setLoading(false);
        setError("Something went wrong! ", err.message);
      });
  }, [url]);             // jab bhi url change hoga tab tab useEffect run karega aur wo url ke resolve aur reject ke basis per wo state ko manage karega... isliye dependency array me url pass kiya gaya hai ....

  return { data, loading, error };
};

export default useFetch;