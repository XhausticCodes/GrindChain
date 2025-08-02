import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SparklesIcon,
  UsersIcon,
  ChartBarIcon,
  BellIcon,
  StarIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Upgrade = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const plans = [
    {
      id: "free",
      name: "Basic",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Individual Task Generation",
        "Up to 3 AI Tasks Generation",
        "Simple analytics",
        "1 study group",
      ],
      limitations: [
        "Limited AI features",
        "No advanced analytics",
        "No priority support",
        "No Custom Themes",
        "No Email Support"
      ],
      buttonText: "Current Grind",
      buttonStyle: "bg-gray-600 text-white cursor-not-allowed",
      popular: false,
    },
    {
      id: "Plus",
      name: "Plus",
      price: "$4.99",
      period: "per month",
      description: "Most popular for serious learners",
      features: [
        "Everything in Basic",
        "Up to 10 AI task generation",
        "Detailed analytics & insights",
        "Email support",
        "Upto 5 study groups",
        "Custom themes",
        "Export data",
        "Progress tracking",
      ],
      limitations: [
        "Limited AI features",
      ],
      buttonText: "Grind with Plus",
      buttonStyle:
        "bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700",
      popular: true,
    },
    {
      id: "ULTRA",
      name: "Ultra",
      price: "$7.99",
      period: "per month",
      description: "For teams and institutions",
      features: [
        "Everything in Pro",
        "Team management",
        "Advanced reporting",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "Advanced Resouces",
        "Advanced security",
        "SLA guarantees",
        "Training sessions",
      ],
      limitations: [],
      buttonText: "Grind with Ultra",
      buttonStyle:
        "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700",
      popular: false,
    },
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleUpgrade = (planId) => {
    if (planId === "free") {
      return; // Current plan
    }
    // Here you would integrate with your payment system
    console.log(`Upgrading to ${planId} plan`);
    // For now, just show an alert
    alert(`Upgrade to ${planId} plan - Payment integration coming soon!`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-full bg-black/20 backdrop-blur-sm p-6 overflow-y-auto rounded-tl-3xl upgrade-scrollbar">
      <div className="max-w-6xl mx-auto pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleBack}
            className="mb-4 flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent yellow-glow-title uppercase"
            style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
          >
            Choose Your Grind
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Unlock the full potential of GrindChain with our premium Grind
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 p-10">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 transition-all duration-300 ${
                selectedPlan === plan.id
                  ? "bg-gradient-to-br from-yellow-400/10 to-amber-500/10 border-2 border-yellow-400/50"
                  : "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50"
              } hover:scale-105 cursor-pointer`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                    <StarIcon className="w-4 h-4 inline mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-yellow-400">
                    {plan.price}
                  </span>
                  <span className="text-white/60 text-sm ml-1">
                    /{plan.period}
                  </span>
                </div>
                <p className="text-white/70 text-sm">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <h4 className="text-white font-semibold mb-3">Features:</h4>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-white/80">
                    <CheckIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Limitations */}
              {plan.limitations.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h4 className="text-white font-semibold mb-3">
                    Limitations:
                  </h4>
                  {plan.limitations.map((limitation, index) => (
                    <div
                      key={index}
                      className="flex items-center text-white/60"
                    >
                      <XMarkIcon className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpgrade(plan.id);
                }}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${plan.buttonStyle}`}
                disabled={plan.id === "free"}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
          <h2
            className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent"
            style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
          >
            Feature Comparison
          </h2>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="font-semibold text-white">Feature</div>
            <div className="text-center font-semibold text-white">Free</div>
            <div className="text-center font-semibold text-yellow-400">
              Plus
            </div>
            <div className="text-center font-semibold text-purple-400">
              ULTRA
            </div>

            {[
              {
                feature: "Daily Tasks",
                free: "5",
                pro: "Unlimited",
                ULTRA: "Unlimited",
              },
              {
                feature: "AI Generation",
                free: "Basic",
                pro: "Advanced",
                ULTRA: "Advanced",
              },
              {
                feature: "Analytics",
                free: "Simple",
                pro: "Detailed",
                ULTRA: "Advanced",
              },
              {
                feature: "Study Groups",
                free: "1",
                pro: "Unlimited",
                ULTRA: "Unlimited",
              },
              {
                feature: "Support",
                free: "Email",
                pro: "Priority",
                ULTRA: "Dedicated",
              },
              {
                feature: "Custom Themes",
                free: "No",
                pro: "Yes",
                ULTRA: "Yes",
              },
              {
                feature: "API Access",
                free: "No",
                pro: "No",
                ULTRA: "Yes",
              },
              {
                feature: "Team Management",
                free: "No",
                pro: "No",
                ULTRA: "Yes",
              },
            ].map((row, index) => (
              <React.Fragment key={index}>
                <div className="text-white/80">{row.feature}</div>
                <div className="text-center text-white/60">{row.free}</div>
                <div className="text-center text-yellow-400/80">{row.pro}</div>
                <div className="text-center text-purple-400/80">
                  {row.ULTRA}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
          <h2
            className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent"
            style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                question: "Can I cancel my subscription anytime?",
                answer:
                  "Yes, you can cancel your subscription at any time. You'll continue to have access to Plus features until the end of your billing period.",
              },
              {
                question: "Do you offer refunds?",
                answer:
                  "We offer a 30-day money-back guarantee for all Plus and ULTRA subscriptions.",
              },
              {
                question: "Can I upgrade or downgrade my plan?",
                answer:
                  "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.",
              },
              {
                question: "Is my data secure?",
                answer:
                  "Absolutely! We use industry-standard encryption and security practices to protect your data. Your privacy is our top priority.",
              },
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-700/50 pb-4">
                <h3 className="text-white font-semibold mb-2">
                  {faq.question}
                </h3>
                <p className="text-white/70 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-8">
          <p className="text-white/60 mb-4">
            Need help choosing the right plan?
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
