import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "../components/login";
import SignUp from "../components/signup";

const Auth = () => {
  const [searchParam] = useSearchParams();
  return (
    <div className="mt-36 flex-col items-center gap-10">
      <h2 className="text-5xl font-extrabold">
        {searchParam.get("createNew")
          ? "Hold up ! Let's login first ..."
          : "Login / Signup"}
      </h2>
      <Tabs defaultValue="login" className="w-[400px] mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default Auth;
