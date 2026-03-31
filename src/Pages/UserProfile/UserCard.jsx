import React from "react";
import Button from "../../Shared/Button";
import { API_BASE_URL } from "../../Redux/Config";

function UserCard({ profile, loading, error }) {
  const isLoading = loading;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 max-w-full text-sm text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 p-4 sm:p-6 max-w-full text-sm text-red-600">
        {error}
      </div>
    );
  }

  const avatarUrl = profile?.image
    ? profile.image.startsWith("http")
      ? profile.image
      : `${API_BASE_URL}${profile.image}`
    : "/dummyavatar.jpg";
  const displayName = profile?.name || profile?.username || "User";
  const username = profile?.username ? `@${profile.username}` : "";
  const biodata = profile?.biodata || "";
  const polls = profile?.poll_count ?? 0;
  const followers = profile?.follower_count ?? 0;
  const following = profile?.following_count ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 max-w-full">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-4 w-full md:w-auto">
          <img
            src={avatarUrl}
            alt="profile"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-full object-cover"
          />
          <div className="mt-2 md:mt-16">
            <div className="text-xl sm:text-2xl font-semibold text-gray-900">
              {displayName}
            </div>
            {username && (
              <div className="text-xs sm:text-sm text-gray-500">{username}</div>
            )}
            {biodata && (
              <div className="text-xs sm:text-sm text-gray-700 mt-2">
                {biodata}
              </div>
            )}
          </div>
        </div>

        {!profile?.is_me && (
          <div className="flex-shrink-0 mt-4 md:mt-0 md:self-start w-full md:w-auto flex justify-center md:justify-start">
            <Button label="Follow" />
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between text-center gap-4 md:gap-0">
        <div className="flex-1">
          <div className="text-2xl md:text-3xl font-semibold text-gray-800">
            {polls}
          </div>
          <div className="text-xs text-gray-500">Polls</div>
        </div>

        <div className="flex-1 md:border-l md:border-r md:border-gray-100 md:px-6">
          <div className="text-2xl md:text-3xl font-semibold text-gray-800">
            {followers}
          </div>
          <div className="text-xs text-gray-500">Followers</div>
        </div>

        <div className="flex-1">
          <div className="text-2xl md:text-3xl font-semibold text-gray-800">
            {following}
          </div>
          <div className="text-xs text-gray-500">Following</div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
