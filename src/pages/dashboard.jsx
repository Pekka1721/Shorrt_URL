import { BarLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useContext, useEffect, useState } from "react";
import { Filter } from "lucide-react";
import Error from "../components/error";
import useFetch from "../hooks/useFetch";
import { getUrls } from "../database/apiUrls";
import { UrlContext } from "../context";
import { getClicksForUrls } from "../database/apiClicks";
import LinkCard from "../components/link-card";


const Dashboard = () => {
  const [searchQuery,setSearchQuery] = useState("");
  const {currentUser} = useContext(UrlContext);

  
 const {loading,error,data:urls,fn:fnUrls}= useFetch(getUrls,currentUser?.id)
 const {loading:loadingClicks,data:clicksData,fn:fnClicks} = useFetch(getClicksForUrls,urls?.map((url)=>url.id));
 useEffect(()=>{
  fnUrls()
 },[])

 useEffect(()=>{
  if(urls?.length)fnClicks()
 },[urls?.length])
const filterUrls = urls?.filter((url)=>url.title.toLowerCase().includes(searchQuery.toLowerCase()));
 console.log(filterUrls,"urls")
  return <div className="space-y-4">
   {loading||loadingClicks&& <BarLoader width={"100%"} color="#36d7b7"/>}
<div className="grid grid-cols-2 gap-4">
<Card>
  <CardHeader>
    <CardTitle>Links Created</CardTitle>
  </CardHeader>
  <CardContent>
    <p>0</p>
  </CardContent>
 
</Card>
<Card>
  <CardHeader>
    <CardTitle>Total Clicks</CardTitle>
  </CardHeader>
  <CardContent>
    <p>0</p>
  </CardContent>
 
</Card>

</div>
   <div className="flex justify-between">
    <h2>My Links</h2>
    <Button>Create Link</Button>
   </div>
   <div className="relative"> 
  <Input type="text" placeholder="Filter Links..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} />
  <Filter className="absolute top-2 right-2 p-1"/>
 {error&&<Error message={error.message}/>}
 {(filterUrls||[]).map((url,i)=>{
  return <LinkCard key={i} url={url} fetchUrls={fnUrls}/>
 })}
   </div>
  </div>
};
export default Dashboard;
