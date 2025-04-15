import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { UrlContext } from "../context";
import supabaseUrl from "../database/supabase";
import useFetch from "../hooks/useFetch";
import { logout } from "../database/apiAuth";
import { ClipLoader } from "react-spinners";

const Header = () => {
  const navigate = useNavigate();
  const {currentUser,fetchUser} = useContext(UrlContext);
const {loading,fn:fnLogout} = useFetch(logout)
  return (
    <>
    <nav className="py-4 flex justify-between items-center">
      <Link to="/">
        <img src="\logoURL (2).png" className="h-16" alt="ShorrrtURL logo" />
      </Link>
      <div>
        {!currentUser ? (
          <Button onClick={() => navigate("/auth")}>Login</Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
              <Avatar>
                <AvatarImage src={currentUser?.user_metadata?.profile_pic} />
                <AvatarFallback>MP</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{currentUser?.user_metadata?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LinkIcon className="mr-2 h-4 w-4" />
                <span>My Links</span>{" "}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400">
                <LogOut className="mr-2 h-4 w-4 text-red-400" />
                <span onClick={()=>{
                  fnLogout().then(()=>{
                    navigate('/')
                  })
                }}>Logout </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

    </nav>
          {loading&&<ClipLoader className="mb-4" width={"100%"} color="#36d7b7"/>}
          </>
  );
};
export default Header;
