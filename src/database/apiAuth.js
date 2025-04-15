import supabase from "./supabase";
import supabaseUrl from "./supabase"

export async function login({email, password}) {

  const { data, error } = await supabase.supabase.auth.signInWithPassword({
    email,password
  })
 
  if (error) throw Error(error.message);
  return data;
}

export async function getUser() {
  const {data:session,error} = await supabase.supabase.auth.getSession();

  if(!session.session) return null;

  if(error) throw new Error(error.message);

  return session.session?.user;
}

export async function signUp({name,email,password,profile_pic}) {
    const filename = `dp-${name.split(" ").join("-")}-${Math.random()}`;
    const{error:stroageError}=await supabase.supabase.storage.from('profile-pic').upload(filename,profile_pic)

  if(stroageError) throw new Error(stroageError.message);

  const {data,error} = await supabase.supabase.auth.signUp({
    email,password,
      options:{
        data:{
          name,
          profile_pic:`${supabaseUrl}/storage/v1/object/public/profile-pic/${filename}`,
        }
      }
  })
  if(error) throw new Error(error.message);
  return data;
}
