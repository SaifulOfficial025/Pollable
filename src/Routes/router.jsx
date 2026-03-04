import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import SettingsHome from "../Pages/Settings/Home";
import UserProfile from "../Pages/UserProfile/Home";
import PremiumHome from "../Pages/Premium/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/settings",
    element: <SettingsHome />,
  },
  {
    path: "/user/",
    element: <UserProfile />,
  },
  {
    path: "/plans",
    element: <PremiumHome />,
  },
]);
