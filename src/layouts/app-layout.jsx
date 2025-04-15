import { Outlet } from "react-router-dom";
import Header from "../components/header";

const AppLayout = () => {
  return (
    <div className="px-16">
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>

      <div className="p-10 text-center bg-gray-800 mt-10 ">
        Made with ⚛️React Vite⚡ by 🧑🏻‍💻{" "}
        <span>
          <a
            href="https://www.linkedin.com/in/rajender-bellanagari/"
            target="_blank"
          >
            Rajender Reddy
          </a>
        </span>
      </div>
    </div>
  );
};
export default AppLayout;
