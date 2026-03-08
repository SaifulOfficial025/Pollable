import React from "react";
import Button from "../../Shared/Button";

function UserCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 max-w-full">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-4 w-full md:w-auto">
          <img
            src="/dummyavatar.jpg"
            alt="profile"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-full object-cover"
          />
          <div className="mt-2 md:mt-16">
            <div className="text-xl sm:text-2xl font-semibold text-gray-900">
              Jubayer Ahmad
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              @ahmadjubayerr
            </div>
            <div className="text-xs sm:text-sm text-gray-700 mt-2">
              Remote work advocate | Building the future of work
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 mt-4 md:mt-0 md:self-start w-full md:w-auto flex justify-center md:justify-start">
          <Button label="Follow" />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between text-center gap-4 md:gap-0">
        <div className="flex-1">
          <div className="text-2xl md:text-3xl font-semibold text-gray-800">
            45
          </div>
          <div className="text-xs text-gray-500">Polls</div>
        </div>

        <div className="flex-1 md:border-l md:border-r md:border-gray-100 md:px-6">
          <div className="text-2xl md:text-3xl font-semibold text-gray-800">
            15,234
          </div>
          <div className="text-xs text-gray-500">Followers</div>
        </div>

        <div className="flex-1">
          <div className="text-2xl md:text-3xl font-semibold text-gray-800">
            892
          </div>
          <div className="text-xs text-gray-500">Following</div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
