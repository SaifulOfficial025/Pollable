import React from "react";
import PollCard from "./PollCard";
import Header from "./Header";
import Sidebar from "./Sidebar";

function SavedPoll() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-16 mt-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-2">
            <Sidebar />
          </div>
          {/* Main content */}
          <div className="col-span-7 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-gray-900">Saved Polls</h2>
            <PollCard />
            <PollCard />
            <PollCard />
          </div>
          {/* Right bar - empty for now */}
          <div className="col-span-3"></div>
        </div>
      </div>
    </div>
  );
}

export default SavedPoll;
