import React from "react";
import PollCard from "./PollCard";
import Header from "./Header";
import Sidebar from "./Sidebar";
import RightBar from "./RightBar";

function SavedPoll() {
  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 ">
        <Header />
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-16 mt-6 max-w-[1536px]">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Sticky */}
          <div className="col-span-12 lg:col-span-2">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>

          {/* Main content - Scrollable */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 pb-24 md:pb-16">
            <h2 className="text-2xl font-bold text-gray-900">Saved Polls</h2>
            <PollCard />
            <PollCard />
            <PollCard />
          </div>

          {/* Right bar - Sticky */}
          <div className="col-span-12 lg:col-span-3 pb-20 md:pb-0">
            <div className="sticky top-24">
              <RightBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedPoll;
