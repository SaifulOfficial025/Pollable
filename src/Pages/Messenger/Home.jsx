import React, { useState } from "react";
import Header from "../Home/Header";
import Sidebar from "../Home/Sidebar";
import MessengerSidebar from "./Sidebar";
import Inbox from "./Inbox";

function MessengerHome() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 ">
        <Header />
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-16 mt-6 max-w-[1536px]">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Sidebar - Sticky */}
          <div className="col-span-12 lg:col-span-2">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>

          {/* Messenger Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <MessengerSidebar
              selectedChat={selectedChat}
              onSelectChat={setSelectedChat}
            />
          </div>

          {/* Inbox */}
          <div className="col-span-12 lg:col-span-7">
            <Inbox selectedChat={selectedChat} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessengerHome;
