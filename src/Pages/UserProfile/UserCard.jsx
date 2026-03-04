import React from "react";
import Button from "../../Shared/Button";

function UserCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-full">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <img
            src="/dummyavatar.jpg"
            alt="profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <div className="text-lg font-semibold text-gray-900">
              Jubayer Ahmad
            </div>
            <div className="text-sm text-gray-500">@ahmadjubayerr</div>
            <div className="text-sm text-gray-700 mt-2">
              Remote work advocate | Building the future of work
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <Button label="Follow" />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-center">
        <div className="flex-1">
          <div className="text-3xl font-semibold text-gray-800">45</div>
          <div className="text-xs text-gray-500">Polls</div>
        </div>

        <div className="flex-1 border-l border-r border-gray-100 px-6">
          <div className="text-3xl font-semibold text-gray-800">15,234</div>
          <div className="text-xs text-gray-500">Followers</div>
        </div>

        <div className="flex-1">
          <div className="text-3xl font-semibold text-gray-800">892</div>
          <div className="text-xs text-gray-500">Following</div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
