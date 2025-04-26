import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { getLongUrl } from "../database/apiUrls";
import { storeClicks } from "../database/apiClicks";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const RedirectLink = ()=>{
    const {id} = useParams();
    const {loading,data,fn}  = useFetch(getLongUrl,id)
    const {loading:loadingstats,fn:fnStats} = useFetch(storeClicks,{
        id:data?.id,
        originalUrl:data?.original_url,
    });
    useEffect(()=>{
        fn()
    },[]);

    useEffect(()=>{
        if(!loading&&data){
            fnStats();
        }
    },[loading])

    if(loading||loadingstats){
        return(<>
        <BarLoader width={"100%"} color="#36d7b7"/>
        Redirecting...
        </> )
    }
    return null;
}

export default RedirectLink;