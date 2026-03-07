import { useState } from "react";
import Container from "../../Layout/Container/Container";
import Header from "./Header";
import PollCard from "./PollCard";
import RightBar from "./RightBar";
import Sidebar from "./Sidebar";
import { IoAddCircleOutline } from "react-icons/io5";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-16 mt-6 ">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-2">
            <Sidebar />
          </div>
          {/* Main content */}
          <div className="col-span-7 flex flex-col gap-6">
            {/* Collapsed composer - triggers global modal */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-4">
                <img
                  src="/dummyavatar.jpg"
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <button
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("openPostPoll"))
                  }
                  className="flex-1 text-left bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-gray-500"
                >
                  What's on your mind? Create a poll...
                </button>

                <button
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("openPostPoll"))
                  }
                  className="ml-2 bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] text-white p-3 rounded-lg"
                >
                  <IoAddCircleOutline className="text-2xl" />
                </button>
              </div>
            </div>

            <PollCard />
            <PollCard />
            <PollCard />
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
