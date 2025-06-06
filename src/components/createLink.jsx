import { useContext, useEffect, useRef, useState } from "react";
import { UrlContext } from "../context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Error from "./error"
import * as YUP from "yup"
import useFetch from "../hooks/useFetch";
import { QRCode } from "react-qrcode-logo";
import { createURL } from "../database/apiUrls";
import { BeatLoader } from "react-spinners";

const CreateLink = ()=>{
    const ref =useRef()
    const {currentUser} = useContext(UrlContext);
    const navigate = useNavigate();
    let [searchParams,setSearchParams] = useSearchParams();
    const longlink = searchParams.get("createNew")

    const [errors, setErrors] = useState({})
    const [formValues, setFormValues] = useState({
        title:"",
        longUrl:longlink?longlink:"",
        customUrl:"",
    })

    const schema = YUP.object().shape({
        title:YUP.string().required("Title is required"),
        longUrl:YUP.string().url("Must be a valid URL").required("Long URL is required"),
        customUrl:YUP.string(),
    })

    const handleChange = (e)=>{
        setFormValues({
            ...formValues,[e.target.id]:e.target.value,
        })
    }
   const{loading,error,data,fn:fnCreateUrl}= useFetch(createURL,{...formValues,user_id:currentUser.id})
    const createNewLink =async ()=>{
            setErrors([]);
            try {
                await schema.validate(formValues,{abortEarly:false})
                const canvas = ref.current.canvasRef.current;
                const blob = await new Promise((resolve)=>canvas.toBlob(resolve))
                await fnCreateUrl(blob)
            } catch (error) {
                const newErrors = {};
                error?.inner?.forEach((err)=>{
                    newErrors[err.path] = err.message
                });
                setErrors(newErrors)
            }
    }

    useEffect(()=>{
        if(error===null&&data){
            navigate(`/link/${data[0].id}`)
        }
    },[error,data])

    return <Dialog defaultOpen={longlink} onOpenChange={(res)=>{if(!res) setSearchParams({})}}>
    <DialogTrigger>
        <Button variant='destructive'>Create New Link</Button>
    </DialogTrigger>
    <DialogContent className ="sm:max-w-md">
      <DialogHeader>
        {formValues?.longUrl&&<QRCode value={formValues?.longUrl} size={250} ref={ref}/>}
        <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
        <Input id="title" placeholder="Short Link's Title" value={formValues.title} onChange={handleChange}/>
        {errors.title && <Error message={errors.title}/>}
        <Input id="longUrl" placeholder="Enter your Loooong URL" value={formValues.longUrl} onChange={handleChange}/>
        {errors.longUrl && <Error message={errors.longUrl}/>}
        <div className="flex items-center gap-2">
            <Card className="p-2">shorrrtUrl.in</Card>/
        <Input id="customUrl" placeholder="Custom Link (optional)" value={formValues.customUrl} onChange={handleChange}/>
       
        </div>
    {error&&<Error message={error.message}/>}
      </DialogHeader>
      <DialogFooter className="sm:justify-start">
        <Button disabled={loading} variant="destructive" onClick={createNewLink}>{loading?<BeatLoader size={10} color="white"/>:"Create"}</Button>
        </DialogFooter>
    </DialogContent>
  </Dialog>
  

}

export default CreateLink;