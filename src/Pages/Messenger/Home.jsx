import React, { useState } from "react";
import Header from "../Home/Header";
import Sidebar from "../Home/Sidebar";
import MessengerSidebar from "./Sidebar";
import Inbox from "./Inbox";

function MessengerHome() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-16 mt-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* Main Sidebar */}
          <div className="col-span-2">
            <Sidebar />
          </div>

          {/* Messenger Sidebar */}
          <div className="col-span-3">
            <MessengerSidebar
              selectedChat={selectedChat}
              onSelectChat={setSelectedChat}
            />
          </div>

          {/* Inbox */}
          <div className="col-span-7">
            <Inbox selectedChat={selectedChat} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessengerHome;
