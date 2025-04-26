import { useContext, useEffect } from "react"
import { UrlContext } from "../context"
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { getUrl } from "../database/apiUrls";
import { getClickForURL } from "../database/apiClicks";
import { deleteUrls } from "../database/apiAuth";
import { BeatLoader,BarLoader } from "react-spinners";
import { LinkIcon,Copy,Download, Trash} from "lucide-react";
import {Button} from '@/ui/components/button';
import {Card,CardHeader,CardTitle,CardDescription,CardContent,CardFooter} from "@/ui/components/card";
import LocationStats from "./locationStats";
import DeviceStats from "./DeviceStats";



const Link = ()=>{
    const {currentUser} = useContext(UrlContext);
    const {id} = useParams();
    const navigate = useNavigate();

    const {loading,data:url,fn,error} = useFetch(getUrl,{id,user_id:currentUser?.id});
    const {loading:loadingStats,data:stats,fn:fnStats}=useFetch(getClickForURL,id)
    const {loading:loadingDelete,fn:fnDelete} = useFetch(deleteUrls,id);

    const downloadImg = ()=>{
        const imageUrl = url?.qr;
        const fileName = url?.title;
        
        const anchor = document.createElement('a');
        anchor.href=imageUrl;
        anchor.download=fileName;

        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }
    useEffect(()=>{
        fn();
        fnStats()
    },[])
    if(error){
        navigate("/dashboard");
    }
    let link = "";
    if(url){
        link = url?.custom_url?url?.custom_url:url.short_url;
    }
    return<>
        {(loading||loadingStats)&&(
            <BarLoader className="mb-5" width={"100%"} color="#36d7b7"/>
        )}
        <div className="flex flex-col gap-8 sm:flex-row justify-between">
            <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
        <span className="text-6xl font-extrabold hover:underline cursor-pointer">{url?.title}</span>
        <a href={`https://shorrt.in/${link}`} className="text-3xl text-blue-400 font-bold hover:underline cursor-pointer" target="_blank">https://shorrt.in/{link}</a>
            </div>
            <a href={url?.original_url} target="_blank" className="flex items-center gap-1 hover:underline cursor-pointer"><LinkIcon/>{url?.original_url}</a>
            <span className="flex items-end font-extralight text-sm">{new Date(url?.created_at).toLocaleString()}</span>
            <div className="flex flex-row gap-2 ">
                    <Button className="hover:cursor-pointer" variant={Ghost} onClick={()=>navigator.clipboard.writeText(`${url?.short_url}`)}>
                        <Copy/>
                    </Button>
                    <Button className="hover:cursor-pointer" variant={Ghost} onClick={downloadImg}>
                        <Download/>
                    </Button>
                    <Button className="hover:cursor-pointer" variant={Ghost} onClick={()=>fnDelete()}>
                        {loadingDelete?<BeatLoader size={5} color="white"/>:<Trash/>}
                        
                    </Button>
                    </div>
                    <img src={url?.qr}
                    className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain" alt="qr code"/>
            
            <Card className="sm:w-3/5">
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                  
                </CardHeader>
                {stats&&stats?.length?(<CardContent className="flex flex-col gap-6">
                    <Card>
  <CardHeader>
    <CardTitle>Total Clicks</CardTitle>
  </CardHeader>
  <CardContent>
    <p>{stats?.length}</p>
  </CardContent>
 
</Card>
<CardTitle><LocationStats stats={{}}/></CardTitle>
<CardTitle><DeviceStats stats={{}}/></CardTitle>
                </CardContent>):(<CardContent>
                    {loadingStats===false?"No statistics yet":"Loading Statics.."}
                </CardContent>)}
            </Card>
        </div>
    </>
}
export default Link;