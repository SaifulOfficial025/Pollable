import React from "react";
import { FiCheck } from "react-icons/fi";
import Button from "../../Shared/Button";

function PricingCard({
  title = "Premium",
  price = "$12",
  period = "/month",
  features,
  buttonLabel = "Upgrade Now",
  onClick,
}) {
  const defaultFeatures = [
    "Everything in Free, plus:",
    "Advanced demographic insights",
    "10 boost credits/month",
    "Priority placement",
    "Ad-free experience",
    "Advanced targeting",
    "Early access to features",
    "Premium badge",
  ];

  const items = features && features.length ? features : defaultFeatures;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-xs h-[550px] flex flex-col justify-between">
      <div className="mb-4">
        <div className="text-lg font-semibold text-gray-800">{title}</div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-7xl font-bold text-gray-900">{price}</div>
          <div className="text-sm text-gray-500">{period}</div>
        </div>
      </div>

      <ul className="space-y-3 mb-6 overflow-auto">
        {items.map((f, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-1 text-blue-500">
              <FiCheck />
            </span>
            <span className="text-md text-gray-600">{f}</span>
          </li>
        ))}
      </ul>

      <div>
        <Button label={buttonLabel} onClick={onClick} fullWidth />
      </div>
    </div>
  );
}

export default PricingCard;
