import supabase from "./supabase";
import supabaseUrl from './supabase';

export async function getUrls(user_id){
    // const {data,error} = await supabase.supabase.from.getSession("urls").select("*").eq("user_id",user_id);
    const {data,error}= await supabase.supabase.from("urls").select('*').eq("user_id",user_id);
    if(error) {
        console.log(error.message);
        throw new Error("Unable to load URLs")
    }
    return data;
}


export async function createURL({title,longUrl,customUrl,user_id},qrcode) {
    const short_url = Math.random().toString(36).substring(2,8)
    const filename = `qr-${short_url}`
    const {error:UrlError} = await supabase.supabase.storage.from('qrs').upload(filename,qrcode);
    if(UrlError) throw new Error(UrlError.message);

    const qr = `${supabaseUrl}/storage/v1/public/qrs/${filename}`
    const {data,error} = await supabase.supabase.from('urls').insert([
        {title,
        original_url:longUrl,
        custom_url:customUrl||null,
        user_id,
        short_url,
        qr
        }
    ]).select();
    if(error){
        console.error(error.message);
        throw new Error("Unable to create URL")
    }
    return data
}

export async function getLongUrl(id) {
    const {data,error} = await supabase.supabase.from('urls').select("id,original_url").or(`short_url_.eq.${id},custom_url.eq${id}`).single();

    if(error){
        console.error(error.message);
        throw new Error("Error fetching short link")
    }
    return data;


}

export async function getUrl({id,user_id}){
    const {data,error} = await supabase.supabase.from('urls').select('*').eq('id',id).eq('user_id',user_id).single();

    if(error){
        console.error(error.message);
        throw new Error("Error fetching Url")
    }
    return data;
}
