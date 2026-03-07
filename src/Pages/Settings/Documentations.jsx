import React from "react";

function Documentations({ type = "terms" }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="prose prose-sm max-w-none">
        {type === "terms" && (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Terms and Conditions
            </h1>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              1. Introduction
            </h2>
            <p className="text-gray-700 mb-4">
              Welcome to Pollable. These terms and conditions outline the rules
              and regulations for the use of our website and services.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              2. License to Use Website
            </h2>
            <p className="text-gray-700 mb-4">
              Unless otherwise stated, Pollable and/or its licensors own the
              intellectual property rights for all material on the website. All
              intellectual property rights are reserved.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              3. User Responsibilities
            </h2>
            <p className="text-gray-700 mb-4">
              As a user of our website, you agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Harass or cause distress or inconvenience to any person</li>
              <li>Transmit obscene or offensive content</li>
              <li>Disrupt the normal flow of dialogue within our website</li>
              <li>Attempt to gain unauthorized access to our systems</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              4. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-4">
              In no event shall Pollable, nor any of its officers, directors and
              employees, be held liable for anything arising out of or in any
              way connected with your use of this website.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              5. Modifications to Terms
            </h2>
            <p className="text-gray-700 mb-4">
              Pollable may revise these terms of service for the website at any
              time without notice. By using this website, you are agreeing to be
              bound by the then current version of these terms of service.
            </p>
          </>
        )}

        {type === "privacy" && (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              1. Introduction
            </h2>
            <p className="text-gray-700 mb-4">
              At Pollable, we are committed to protecting your privacy. This
              privacy policy explains how we collect, use, disclose, and
              safeguard your information.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              2. Information We Collect
            </h2>
            <p className="text-gray-700 mb-4">
              We may collect information about you in a variety of ways. The
              information we may collect on the site includes:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>
                <strong>Personal Data:</strong> Name, email address, phone
                number, and other identifying information
              </li>
              <li>
                <strong>Financial Data:</strong> Financial information such as
                credit card or payment information
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact
                with our service
              </li>
              <li>
                <strong>Device Data:</strong> IP address, browser type,
                operating system, and device information
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              3. Use of Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              Having accurate information about you permits us to provide you
              with a smooth, efficient, and customized experience. We use
              information collected in the following ways:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>To generate analytics about how you use our service</li>
              <li>To monitor and analyze trends, usage, and activities</li>
              <li>To personalize and improve the website and services</li>
              <li>
                To process your transactions and send you related information
              </li>
              <li>To send promotional communications (if you opt-in)</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              4. Disclosure of Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We may share your information with third parties who perform
              services for us or with your consent. We do not sell, trade, or
              rent your personal identification information to others.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              5. Security of Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We use administrative, technical, and physical security measures
              to protect your personal information. However, no method of
              transmission over the Internet is 100% secure.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              6. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have questions or comments about this privacy policy,
              please contact us at privacy@pollable.com
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Documentations;
