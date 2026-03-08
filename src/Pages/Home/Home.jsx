import { useState } from "react";
import Container from "../../Layout/Container/Container";
import Header from "./Header";
import PollCard from "./PollCard";
import RightBar from "./RightBar";
import Sidebar from "./Sidebar";
import { IoAddCircleOutline } from "react-icons/io5";
import PollCardWithOneImage from "./PollCardWithOneImage";
import PollCardwithMultiImage from "./PollCardwithMultiImage";

const Home = () => {
  // Dummy poll data
  const pollData1 = {
    user: {
      name: "Sarah Mitchell",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      timeAgo: "2 hours ago",
    },
    question: "What's your preferred work setup post-pandemic?",
    options: [
      { label: "Fully Remote", votes: 684, percent: 68 },
      { label: "Hybrid (2-3 days office)", votes: 241, percent: 24 },
      { label: "Full-time Office", votes: 80, percent: 8 },
    ],
    likes: 342,
    comments: 156,
  };

  const pollData2 = {
    user: {
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      timeAgo: "5 hours ago",
    },
    question:
      "Which programming language should I learn next for web development?",
    options: [
      { label: "TypeScript", votes: 580, percent: 45 },
      { label: "Python", votes: 390, percent: 30 },
      { label: "Go", votes: 195, percent: 15 },
      { label: "Rust", votes: 130, percent: 10 },
    ],
    likes: 289,
    comments: 94,
  };

  const pollWithImageData = {
    user: {
      name: "Emma Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      timeAgo: "1 hour ago",
    },
    question: "Which social media platform do you use most for news?",
    bannerImage:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=400&fit=crop",
    options: [
      { label: "Twitter/X", votes: 420, percent: 42 },
      { label: "Reddit", votes: 260, percent: 26 },
      { label: "Instagram", votes: 190, percent: 19 },
      { label: "Traditional news sites", votes: 130, percent: 13 },
    ],
    likes: 567,
    comments: 203,
    Polloftheday: true,
  };

  const pollWithMultiImageData = {
    user: {
      name: "Alex Thompson",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      timeAgo: "3 hours ago",
    },
    question:
      "Which travel destination would you choose for your next vacation?",
    options: [
      {
        id: 1,
        label: "Tokyo, Japan",
        image:
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=400&fit=crop",
        votes: 340,
        percent: 34,
      },
      {
        id: 2,
        label: "Paris, France",
        image:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=400&fit=crop",
        votes: 280,
        percent: 28,
      },
      {
        id: 3,
        label: "Santorini, Greece",
        image:
          "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=400&fit=crop",
        votes: 240,
        percent: 24,
      },
      {
        id: 4,
        label: "Bali, Indonesia",
        image:
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=400&fit=crop",
        votes: 140,
        percent: 14,
      },
    ],
    likes: 423,
    comments: 178,
    Polloftheday: true,
  };

  const pollData3 = {
    user: {
      name: "Jessica Park",
      avatar: "https://randomuser.me/api/portraits/women/90.jpg",
      timeAgo: "8 hours ago",
    },
    question:
      "What's your biggest productivity challenge when working from home?",
    options: [
      { label: "Distractions & interruptions", votes: 450, percent: 40 },
      { label: "Maintaining work-life balance", votes: 338, percent: 30 },
      { label: "Staying motivated", votes: 225, percent: 20 },
      { label: "Technical issues", votes: 113, percent: 10 },
    ],
    likes: 198,
    comments: 67,
  };

  // Extra text-only polls with varying option counts
  const pollData4 = {
    user: {
      name: "David Miller",
      avatar: "https://randomuser.me/api/portraits/men/17.jpg",
      timeAgo: "30 minutes ago",
    },
    question: "Coffee or tea to start your day?",
    options: [
      { label: "Coffee", votes: 510, percent: 68 },
      { label: "Tea", votes: 240, percent: 32 },
    ],
    likes: 154,
    comments: 41,
  };

  const pollData5 = {
    user: {
      name: "Olivia Brown",
      avatar: "https://randomuser.me/api/portraits/women/37.jpg",
      timeAgo: "12 hours ago",
    },
    question: "Which feature should we build next for our app?",
    options: [
      { label: "Dark mode", votes: 420, percent: 35 },
      { label: "In-app chat", votes: 360, percent: 30 },
      { label: "Offline support", votes: 300, percent: 25 },
      { label: "Advanced analytics", votes: 120, percent: 10 },
    ],
    likes: 276,
    comments: 89,
  };

  // Extra banner-image polls
  const pollWithImageData2 = {
    user: {
      name: "Liam Johnson",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      timeAgo: "3 hours ago",
    },
    question: "Which type of content do you enjoy most on YouTube?",
    bannerImage:
      "https://images.unsplash.com/photo-1516031190212-da133013de50?w=800&h=400&fit=crop",
    options: [
      { label: "Tech reviews", votes: 310, percent: 31 },
      { label: "Vlogs", votes: 260, percent: 26 },
      { label: "Educational", votes: 290, percent: 29 },
      { label: "Gaming", votes: 140, percent: 14 },
    ],
    likes: 332,
    comments: 120,
  };

  const pollWithImageData3 = {
    user: {
      name: "Noah Smith",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg",
      timeAgo: "1 day ago",
    },
    question: "Which design style best fits our new landing page?",
    bannerImage:
      "https://images.unsplash.com/photo-1522202195461-41b9a15c3b99?w=800&h=400&fit=crop",
    options: [
      { label: "Minimal & clean", votes: 380, percent: 38 },
      { label: "Bold & colorful", votes: 320, percent: 32 },
      { label: "Illustration heavy", votes: 190, percent: 19 },
      { label: "Corporate", votes: 110, percent: 11 },
    ],
    likes: 241,
    comments: 63,
  };

  // Extra multi-image polls to showcase 2–10 options
  const pollWithMultiImageData2 = {
    user: {
      name: "Isabella Garcia",
      avatar: "https://randomuser.me/api/portraits/women/52.jpg",
      timeAgo: "45 minutes ago",
    },
    question: "Pick your favorite photography style.",
    options: [
      {
        id: 1,
        label: "Portrait",
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
        votes: 210,
        percent: 35,
      },
      {
        id: 2,
        label: "Landscape",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop",
        votes: 195,
        percent: 32,
      },
      {
        id: 3,
        label: "Street",
        image:
          "https://images.unsplash.com/photo-1506086679524-493c64fdfaa6?w=400&h=400&fit=crop",
        votes: 125,
        percent: 21,
      },
    ],
    likes: 189,
    comments: 52,
  };

  const pollWithMultiImageData3 = {
    user: {
      name: "Mia Wilson",
      avatar: "https://randomuser.me/api/portraits/women/15.jpg",
      timeAgo: "6 hours ago",
    },
    question: "Which UI theme would you install on your phone?",
    options: [
      {
        id: 1,
        label: "Neon Dark",
        image:
          "https://images.unsplash.com/photo-1516357231954-91487b459602?w=400&h=400&fit=crop",
        votes: 180,
        percent: 20,
      },
      {
        id: 2,
        label: "Pastel Light",
        image:
          "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=400&h=400&fit=crop",
        votes: 160,
        percent: 18,
      },
      {
        id: 3,
        label: "Glassmorphism",
        image:
          "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=400&h=400&fit=crop",
        votes: 210,
        percent: 24,
      },
      {
        id: 4,
        label: "Material You",
        image:
          "https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?w=400&h=400&fit=crop",
        votes: 140,
        percent: 16,
      },
      {
        id: 5,
        label: "Monochrome",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop",
        votes: 120,
        percent: 14,
      },
      {
        id: 6,
        label: "Gradient",
        image:
          "https://images.unsplash.com/photo-1517697471339-4aa32003c11a?w=400&h=400&fit=crop",
        votes: 80,
        percent: 8,
      },
    ],
    likes: 301,
    comments: 97,
  };

  const pollWithMultiImageData4 = {
    user: {
      name: "Ethan Lee",
      avatar: "https://randomuser.me/api/portraits/men/29.jpg",
      timeAgo: "2 days ago",
    },
    question: "Choose the best marketing campaign visual.",
    options: [
      {
        id: 1,
        label: "Urban Lifestyle",
        image:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop",
        votes: 130,
        percent: 13,
      },
      {
        id: 2,
        label: "Nature Escape",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop",
        votes: 150,
        percent: 15,
      },
      {
        id: 3,
        label: "Fitness Focus",
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
        votes: 160,
        percent: 16,
      },
      {
        id: 4,
        label: "Cozy Home",
        image:
          "https://images.unsplash.com/photo-1484100356142-db6ab6244067?w=400&h=400&fit=crop",
        votes: 140,
        percent: 14,
      },
      {
        id: 5,
        label: "Healthy Food",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop",
        votes: 120,
        percent: 12,
      },
      {
        id: 6,
        label: "Tech Future",
        image:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
        votes: 110,
        percent: 11,
      },

      {
        id: 8,
        label: "Luxury Fashion",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        votes: 80,
        percent: 8,
      },
      {
        id: 9,
        label: "Minimal Product",
        image:
          "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=400&h=400&fit=crop",
        votes: 70,
        percent: 7,
      },
      {
        id: 10,
        label: "Abstract Art",
        image:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop",
        votes: 50,
        percent: 5,
      },
    ],
    likes: 412,
    comments: 133,
  };

  // Create array of all polls with their component types
  const allPolls = [
    { data: pollData1, type: "normal", id: 1 },
    { data: pollData2, type: "normal", id: 2 },
    { data: pollWithImageData, type: "withImage", id: 3 },
    { data: pollWithMultiImageData, type: "multiImage", id: 4 },
    { data: pollData3, type: "normal", id: 5 },
    { data: pollData4, type: "normal", id: 6 },
    { data: pollData5, type: "normal", id: 7 },
    { data: pollWithImageData2, type: "withImage", id: 8 },
    { data: pollWithImageData3, type: "withImage", id: 9 },
    { data: pollWithMultiImageData2, type: "multiImage", id: 10 },
    { data: pollWithMultiImageData3, type: "multiImage", id: 11 },
    { data: pollWithMultiImageData4, type: "multiImage", id: 12 },
  ];

  // Sort to show "Poll of the day" first
  const sortedPolls = allPolls.sort((a, b) => {
    if (a.data.Polloftheday && !b.data.Polloftheday) return -1;
    if (!a.data.Polloftheday && b.data.Polloftheday) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen  ">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 ">
        <Header />
      </div>

      <div className=" mx-auto px-4 sm:px-6 lg:px-16 mt-6 max-w-[1536px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Sticky */}
          <div className="col-span-12 lg:col-span-2">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>

          {/* Main content - Scrollable */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 pb-24 md:pb-16">
            {/* Collapsed composer - triggers global modal */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src="/dummyavatar.jpg"
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <button
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("openPostPoll"))
                    }
                    className="flex-1 text-left bg-gray-50 border border-gray-200 rounded-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-500"
                  >
                    What's on your mind? Create a poll...
                  </button>
                </div>

                <button
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("openPostPoll"))
                  }
                  className="mt-3 sm:mt-0 ml-0 sm:ml-2 bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] text-white px-4 py-2.5 sm:px-3 sm:py-3 rounded-lg flex items-center justify-center w-full sm:w-auto"
                >
                  <IoAddCircleOutline className="text-xl sm:text-2xl" />
                </button>
              </div>
            </div>

            {/* Dynamically render sorted polls */}
            {sortedPolls.map((poll) => {
              if (poll.type === "normal") {
                return <PollCard key={poll.id} pollData={poll.data} />;
              } else if (poll.type === "withImage") {
                return (
                  <PollCardWithOneImage key={poll.id} pollData={poll.data} />
                );
              } else if (poll.type === "multiImage") {
                return (
                  <PollCardwithMultiImage key={poll.id} pollData={poll.data} />
                );
              }
              return null;
            })}
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
};

export default Home;
