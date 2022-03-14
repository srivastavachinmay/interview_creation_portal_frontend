import axios                   from "axios";
import { useEffect, useState } from "react";

const useFetch = ( url: string ) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const abortController = new AbortController();
        axios.get(url,{signal:abortController.signal})
        // fetch(url, { method:"GET",signal: abortController.signal })
            .then(( res ) => {
                let status=res.status
                if(!res)
                    throw new Error(`Unable to fetch data. Status Code: ${status}`);
                return res.data;
            })
            .then(( data ) => {
                setData(data);
                setIsPending(false);
                setError(null);
            })
            .catch(( err ) => {
                if(err.name === "AbortFetch") console.log("fetch aborted!");
                else {
                    setError(err.message);
                    setIsPending(false);
                }
            });
        return () => abortController.abort();
    }, [url]);
    
    return { data, error, isPending };
};

export default useFetch;