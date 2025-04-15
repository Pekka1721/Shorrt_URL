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
import { useEffect, useState ,useContext} from "react";
import {ClipLoader} from "react-spinners"
import useFetch from "../hooks/useFetch";
import { signUp } from "../database/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlContext } from "../context";
import * as Yup from 'yup';
import Error from "./error";

const SignUp = () => {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  let longLink= searchParams.get('createNew');
  const [singUpForm,setSignUpForm] = useState({
    name:"",
    email:"",
    password:"",
    profile_pic:null
  })
const [formError,setError] = useState([]);
  //input

  const handleInputChange = (e)=>{
    const {name,value,files} = e.target;
    setSignUpForm((prev)=>({
      ...prev,
      [name]:files?files[0]:value,
    }))
  };
 
  const {data,error:signUpError,loading,fn:fnSignUp} = useFetch(signUp,singUpForm);
 const {fetchCurrentUser}= useContext(UrlContext);

 useEffect(()=>{
  if(signUpError===null&&data){
    navigate(`/dashboard?${longLink?`createNew=${longLink}`:""}`);
    fetchCurrentUser();
  }
},[signUpError,loading])

  const handleSignUp = async()=>{
    setError([]);
    try {
      const schema = Yup.object().shape({
        name:Yup.string().required("Name is required"),
        email:Yup.string().email("Invalid Email").required("Email is Required"),
        password:Yup.string().min(6,"Password must be at least 6 characters").required("Password is Required"),
        profile_pic:Yup.mixed().required("Profile picture is required"),
      });
      await schema.validate(singUpForm,{abortEarly:false});
      await fnSignUp()
    } catch (error) {
      const newErrors = {};
      error?.inner?.forEach((err)=>{
        newErrors[err.path]=err.message;
      });
      setError(newErrors);
    }
  }
  return <div>
    <Card className="w-[350px]">
  <CardHeader>
    <CardTitle>Sign Up</CardTitle>
    <CardDescription>New? Create an account</CardDescription>
    {signUpError&&<Error message={signUpError.message}/>}
  </CardHeader>
  <CardContent className='spcace-y-2'>
 
      <div className="grid w-full items-center gap-4">
      <div>
          <Input name="name" type="text" placeholder="Name" onChange={handleInputChange}/>
          {formError.name&&<Error message={formError.name}/>}
        </div>
        <div className="flex flex-col space-y-1.5"> 
           <Input name="email" type="email" placeholder="Email" onChange={handleInputChange}/>
           {formError.email&&<Error message={formError.email}/>}
        </div>
        <div className="flex flex-col space-y-1.5"> 
           <Input  name="password" type="password" placeholder="Password" onChange={handleInputChange}/>
           {formError.password&&<Error message={formError.password}/>}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Input name="profile_pic" type="file" accept="image/*" onChange={handleInputChange}/>
          {formError.profile_pic&&<Error message={formError.profile_pic}/>}
        </div>
        
      </div>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button onClick={handleSignUp}>{loading?<ClipLoader size={25} color="green" speedMultiplier={0.75}/>:"Create Account"}</Button>

  </CardFooter>
</Card>
</div>
};

export default SignUp;
