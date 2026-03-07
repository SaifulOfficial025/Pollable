import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home";
import SettingsHome from "../Pages/Settings/Home";
import UserProfile from "../Pages/UserProfile/Home";
import PremiumHome from "../Pages/Premium/Home";
import MessengerHome from "../Pages/Messenger/Home";
import SavedPoll from "../Pages/Home/SavedPoll";
import SignIn from "../Pages/Authentication/SignIn";
import SignUp from "../Pages/Authentication/Signup";
import RegOTPVerification from "../Pages/Authentication/RegOTPVerification";
import ForgetPassOTPVerification from "../Pages/Authentication/ForgetPassOTPVerification";
import ResetPassword from "../Pages/Authentication/ResetPassword";
import ForgetPasswordEmail from "../Pages/Authentication/ForgetPasswordEmail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
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
      {
        path: "/messages",
        element: <MessengerHome />,
      },
      {
        path: "/saved",
        element: <SavedPoll />,
      },
      {
        path: "*",
        element: <Home />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/registration-otp-verification",
        element: <RegOTPVerification />,
      },
      {
        path: "/forget-password-otp-verification",
        element: <ForgetPassOTPVerification />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "forget-password-email",
        element: <ForgetPasswordEmail />,
      }
    ],
  },
]);
