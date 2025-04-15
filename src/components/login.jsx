
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card" 
import {Input} from "@/components/ui/input"
import {ClipLoader} from "react-spinners"
import Error from "./error"
import { useContext, useEffect, useState } from "react"
import * as Yup from "yup";
import useFetch from "../hooks/useFetch"
import { login } from "../database/apiAuth"
import { useNavigate, useSearchParams } from "react-router-dom"
import { UrlContext } from "../context"


const Login = () => {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew")
  const [error,setError] = useState([]);
  const [formdata,setFormdata] = useState({
    email:"",
    password:""
  })
  const handleInputChange=(e)=>{
   const{name,value}= e.target;
   setFormdata((prevState)=>({
    ...prevState,
    [name]:value,
   }))
  }
  
 const {data,error:apiError,loading,fn:fnLogin}=  useFetch(login,formdata)
 const {fetchCurrentUser}= useContext(UrlContext);
 
 useEffect(()=>{
  if(apiError==null&&data){
    navigate(`/dashboard?${longLink?`createNew=${longLink}`:''}`)
    fetchCurrentUser();
  }
 },[data,apiError])


  const handleLogin = async()=>{
    setError([])
    try {
      //define schema 
      const scheme = Yup.object().shape({
        email:Yup.string().email("Invalid email").required('Email is required'),
        password:Yup.string().min(7,"Password must be at least 7 characters").required("Password is Required")
      })
      await scheme.validate(formdata,{abortEarly:false});
      await fnLogin()
    } catch (error) {
      const newErrors = {}
      error?.inner?.forEach((er)=>{
        newErrors[er.path]=er.message;
      });
      setError(newErrors);
    }
  }
  return <div>
     <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to your account</CardDescription>
        {apiError&&<Error message={apiError.message}/>}
      </CardHeader>
      <CardContent className='spcace-y-2'>
     
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5"> 
               <Input  name="email" type="email" placeholder="Email" onChange={handleInputChange}/>
               {error.email&&<Error message={error.email}/>}
            </div>
            <div className="flex flex-col space-y-1.5"> 
               <Input  name="password" type="password" placeholder="Password" onChange={handleInputChange}/>
               {error.password&&<Error message={error.password}/>}
            </div>
          </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleLogin}>{loading?<ClipLoader size={25} color="green" speedMultiplier={0.75}/>:"Login"}</Button>

      </CardFooter>
    </Card>
    
  </div>;
};

export default Login;
