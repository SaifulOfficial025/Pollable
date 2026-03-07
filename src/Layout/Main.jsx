import { Outlet } from "react-router-dom";
import CreatePostModal from "../Pages/CreatePost/Home";

const Main = () => {
  return (
    <div>
      <CreatePostModal />
      <Outlet />
    </div>
  );
};

export default Main;
