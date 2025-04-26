import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Copy, Download, Ghost, Trash } from "lucide-react";
import useFetch from "../hooks/useFetch";
import { deleteUrls } from "../database/apiAuth";
import {BeatLoader} from 'react-spinners'
const LinkCard = ({url,fetchUrls})=>{
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
    const {loading:loadingDelete,fn:fnDelete}=useFetch(deleteUrls,url?.id);
    return <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
        <img src={url?.qr} className="h-32 object-contain ring ring-blue-500 self-start" alt="qr-code" />
        <Link to={`/link/${url.id}`} className="flex flex-col flex-2">
        <span className="text-3xl font-extrabold hover:underline cursor-pointer">{url?.title}</span>
        <span className="text-xl text-blue-400 font-extrabold hover:underline cursor-pointer wrap">{url?.custom_url?url?.custom_url:url.short_url}</span>
        <span className="flex items-center gap-1 text-sm hover:underline cursor-pointer sm:wrap">{url?.original_url}</span>
        <span className="flex items-end font-extralight text-sm flex-1">{new Date(url?.created_at).toLocaleString()}</span>
        </Link>
        <div className="flex flex-row gap-2 ">
        <Button className="hover:cursor-pointer" variant={Ghost} onClick={()=>navigator.clipboard.writeText(`${url?.short_url}`)}>
            <Copy/>
        </Button>
        <Button className="hover:cursor-pointer" variant={Ghost} onClick={downloadImg}>
            <Download/>
        </Button>
        <Button className="hover:cursor-pointer" variant={Ghost} onClick={()=>fnDelete().then(()=>fetchUrls())}>
            {loadingDelete?<BeatLoader size={5} color="white"/>:<Trash/>}
            
        </Button>
        </div>
    </div>
}
export default LinkCard;