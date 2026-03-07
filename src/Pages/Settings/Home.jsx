import React, { useState } from "react";
import Header from "../Home/Header";
import Sidebar from "./Sidebar";
import Password from "./Password";
import BlockedUser from "./BlockedUser";
import Accounts from "./Accounts";
import Documentations from "./Documentations";
import Profile from "./Profile";

const SettingsHome = () => {
  const [selected, setSelected] = useState("blocked");

  function handleSelect(key) {
    if (key === "back") {
      // Optional: navigate back - for now do nothing
      return;
    }
    setSelected(key);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <Sidebar selected={selected} onSelect={handleSelect} />
          </div>

          <div className="col-span-9">
            {selected === "profile" && <Profile />}
            {selected === "account" && <Accounts />}
            {selected === "password" && <Password />}
            {selected === "blocked" && <BlockedUser />}
            {selected === "terms" && <Documentations type="terms" />}
            {selected === "privacy" && <Documentations type="privacy" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsHome;
