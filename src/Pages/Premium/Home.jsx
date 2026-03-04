import React from "react";
import PricingCard from "./PricingCard";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

export default function PremiumHome() {
  const freeFeatures = [
    "Create unlimited polls",
    "Vote on all polls",
    "Basic analytics",
    "Standard visibility",
    "Comment on polls",
  ];

  const premiumFeatures = [
    "Everything in Free, plus:",
    "Advanced demographic insights",
    "10 boost credits/month",
    "Priority placement",
    "Ad-free experience",
    "Advanced targeting",
    "Early access to features",
    "Premium badge",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top bar with back and title */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <IoMdArrowRoundBack className="text-lg" />
            Back
          </Link>
          <div className="text-sm font-medium text-gray-800">
            Upgrade to Premium
          </div>
          <div />
        </div>

        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <img
            src="/premiumicon.svg"
            alt="premium"
            className="mx-auto w-12 h-12 mb-4"
          />
          <h1 className="text-4xl font-extrabold text-gray-900">
            Unlock Premium Features
          </h1>
          <p className="mt-2 text-md text-gray-500">
            Get advanced insights, boost credits, and priority support
          </p>
        </div>

        {/* Pricing cards */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex justify-center">
            <div className="w-full hover:scale-105 transform transition-transform">
              <PricingCard
                title="Free"
                price="$0"
                period="/month"
                features={freeFeatures}
                buttonLabel="Current Plan"
                onClick={() => {}}
              />
            </div>
          </div>

          <div className="flex justify-center -mt-2 md:mt-0">
            <div className="w-full hover:scale-105 transform transition-transform">
              <div className="p-2">
                <PricingCard
                  title="Premium"
                  price="$12"
                  period="/month"
                  features={premiumFeatures}
                  buttonLabel="Upgrade Now"
                  onClick={() => alert("Upgrade flow")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
