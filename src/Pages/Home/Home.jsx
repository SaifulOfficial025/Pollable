import { useState } from "react";
import Container from "../../Layout/Container/Container";
import Header from "./Header";
import PollCard from "./PollCard";
import PostPoll from "./PostPoll";
import RightBar from "./RightBar";
import Sidebar from "./Sidebar";
import SavedPoll from "./SavedPoll";

const Home = () => {
  const [mainView, setMainView] = useState("feed");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-16 mt-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-2">
            <Sidebar setMainView={setMainView} />
          </div>
          {/* Main content */}
          <div className="col-span-7 flex flex-col gap-6">
            {mainView === "saved" ? (
              <SavedPoll />
            ) : (
              <>
                <PostPoll />
                <PollCard />
                <PollCard />
                <PollCard />
              </>
            )}
          </div>
          {/* Right bar */}
          <div className="col-span-3">
            <RightBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
