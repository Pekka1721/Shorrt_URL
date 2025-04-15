import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UrlContext } from "../context";
import { ClipLoader } from "react-spinners";

function RequireAuth({children}){
    const navigate = useNavigate();
    const{loading,isAuthenticated} = useContext(UrlContext);

    useEffect(()=>{
        if(!isAuthenticated&&loading==false) navigate('/auth');
    },[isAuthenticated,loading]);

    if(loading) return <ClipLoader width={"100%"} color="#36d7b7"/>
    if(isAuthenticated ) return children;
}

export default RequireAuth
