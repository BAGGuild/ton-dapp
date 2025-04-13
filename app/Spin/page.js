"use client";

import { useRef, useState, useEffect } from "react";

const rewards = [
  { label: "🎁 Bonus", type: "normal" },
  { label: "💎 Diamond", type: "rare" },
  { label: "🪙 Coins", type: "normal" },
  { label: "🎫 Voucher", type: "normal" },
  { label: "🎮 Sticker", type: "normal" },
  { label: "🚀 Boost", type: "rare" },
  { label: "🔒 Lock", type: "legendary" },
  { label: "🎉 Surprise", type: "legendary" },
];

// Define probability for each type
const rewardProbabilities = {
  normal: 70, // 70% chance for normal
  rare: 20, // 20% chance for rare
  legendary: 10, // 10% chance for legendary
};

// Helper function to select item based on probability
const getRandomReward = () => {
  // Generate a random number between 1 and 100
  const randomNum = Math.random() * 100;

  let cumulativeProbability = 0;
  // Iterate over the reward types and assign probability ranges
  for (const [type, probability] of Object.entries(rewardProbabilities)) {
    cumulativeProbability += probability;
    if (randomNum <= cumulativeProbability) {
      // Select a reward from the corresponding type
      const filteredRewards = rewards.filter((reward) => reward.type === type);
      const randomReward = filteredRewards[Math.floor(Math.random() * filteredRewards.length)];
      return randomReward;
    }
  }
};

export default function SpinPage() {
  const containerRef = useRef(null);
  const [selectedReward, setSelectedReward] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const itemWidth = 130;
  const itemMargin = 10;
  const totalItemWidth = itemWidth + itemMargin * 2;
  const wheelWidth = 600;
  const centerPointerOffset = wheelWidth / 2 - totalItemWidth / 2;
  const extraPadding = wheelWidth * 2;
  const resetDelay = 1000;

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(${centerPointerOffset}px)`;
      containerRef.current.style.opacity = "1";
    }
  }, []);

  const startSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setReveal(false);
    setButtonDisabled(true);

    const container = containerRef.current;
    const rotations = Math.floor(Math.random() * 3) + 5;
    const selectedReward = getRandomReward();
    setSelectedReward(selectedReward.label);

    const targetIndex = rewards.findIndex((reward) => reward.label === selectedReward.label);
    const targetPosition = targetIndex * totalItemWidth;
    const totalDistance = rotations * rewards.length * totalItemWidth + targetPosition - centerPointerOffset;

    container.style.transition = "transform 5s cubic-bezier(0.17, 0.67, 0.21, 0.99)";
    container.style.transform = `translateX(-${totalDistance}px)`;

    setTimeout(() => {
      setSpinning(false);
      setReveal(true);
      const resetPosition = targetPosition - centerPointerOffset;
      setTimeout(() => {
        container.style.transition = "none";
        container.style.transform = `translateX(-${resetPosition}px)`;
      }, resetDelay);

      setTimeout(() => setButtonDisabled(false), 60000);
    }, 5000);
  };

  const renderRewardItems = () => {
    const items = [];
    for (let set = 0; set < 10; set++) {
      rewards.forEach((reward, idx) => {
        items.push(
          <div
            key={`${set}-${idx}`}
            className="flex-shrink-0 flex items-center justify-center text-2xl font-bold text-white"
            style={{
              width: `${itemWidth}px`,
              height: "100px",
              margin: `0 ${itemMargin}px`,
              background: idx % 2 ? "#334155" : "#1e293b",
              borderRadius: "8px",
              boxShadow: "inset 0 0 8px rgba(0,0,0,0.5)",
            }}
          >
            {reward.label}
          </div>
        );
      });
    }
    return items;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Spin Wheel</h1>

      <div className="relative w-[600px] h-[120px] overflow-hidden border-4 border-yellow-400 rounded-lg bg-gray-900 shadow-xl">
        <div className="absolute inset-0 flex items-center">
          <div className="h-[2px] w-full bg-gray-600/50"></div>
        </div>

        <div
          ref={containerRef}
          className="flex absolute left-0 h-full items-center opacity-100"
          style={{
            paddingLeft: `${extraPadding}px`,
            paddingRight: `${extraPadding}px`,
            transform: `translateX(${centerPointerOffset}px)`,
          }}
        >
          {renderRewardItems()}
        </div>

        <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-[4px] bg-red-500 z-10"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
      </div>

      <button onClick={startSpin} disabled={buttonDisabled || spinning} className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        {spinning ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Spinning...
          </span>
        ) : (
          "Spin Now"
        )}
      </button>

      {reveal && selectedReward && <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-lg animate-pulse">🎉 You won: {selectedReward} 🎉</div>}
    </div>
  );
}
