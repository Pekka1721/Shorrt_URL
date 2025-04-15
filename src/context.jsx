import { createContext, useContext, useEffect } from "react";
import useFetch from "./hooks/useFetch";
import { getUser } from "./database/apiAuth";

export const UrlContext = createContext();

const UrlProvider = ({children})=>{
    const {data:currentUser,loading,fn:fetchCurrentUser} = useFetch(getUser);
    const isAuthenticated = currentUser?.role==='authenticated';

    useEffect(()=>{
        fetchCurrentUser();
    },[])

    return <UrlContext.Provider value={{currentUser,fetchCurrentUser,loading,isAuthenticated}}>
        {children}
    </UrlContext.Provider>
}
// export const UrlState = ()=>{
//     return useContext(UrlContext);
// }

export default UrlProvider