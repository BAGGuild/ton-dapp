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

const rewardProbabilities = {
  normal: 98,
  rare: 1.999,
  legendary: 0.001,
};

const getRandomReward = () => {
  const randomNum = Math.random() * 100;
  let cumulativeProbability = 0;
  for (const [type, probability] of Object.entries(rewardProbabilities)) {
    cumulativeProbability += probability;
    if (randomNum <= cumulativeProbability) {
      const filteredRewards = rewards.filter((reward) => reward.type === type);
      const randomReward = filteredRewards[Math.floor(Math.random() * filteredRewards.length)];
      return randomReward;
    }
  }
  return rewards[0]; // Fallback
};

export default function SpinPage() {
  const containerRef = useRef(null);
  const [selectedReward, setSelectedReward] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showStaticRewards, setShowStaticRewards] = useState(true);

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
    setShowStaticRewards(false); // Hide static rewards on spin

    // Ensure containerRef.current is available
    const container = containerRef.current;
    if (!container) return; // Exit early if container is null

    const rotations = Math.floor(Math.random() * 3) + 5;
    const reward = getRandomReward();
    setSelectedReward(reward.label);

    const targetIndex = rewards.findIndex((r) => r.label === reward.label);
    const targetPosition = targetIndex * totalItemWidth;
    const totalDistance = rotations * rewards.length * totalItemWidth + targetPosition - centerPointerOffset;

    container.style.transition = "transform 5s cubic-bezier(0.17, 0.67, 0.21, 0.99)";
    container.style.transform = `translateX(-${totalDistance}px)`;

    setTimeout(() => {
      setSpinning(false);
      setReveal(true);
      setButtonDisabled(false);

      const resetPosition = targetPosition - centerPointerOffset;

      // Reset the wheel position instantly (no animation)
      setTimeout(() => {
        container.style.transition = "none";
        container.style.transform = `translateX(-${resetPosition}px)`;

        // Show the static rewards AFTER reset is applied
        setShowStaticRewards(true);
      }, resetDelay); // Wait until after the spinning animation ends

      // Optionally disable spin for 60 seconds (for cooldown)
      setTimeout(() => setButtonDisabled(false), 60000);
    }, 5000);
  };

  const renderRewardItems = () => {
    const items = [];
    for (let set = 0; set < 10; set++) {
      rewards.forEach((reward, idx) => {
        const typeColor = reward.type === "legendary" ? "from-yellow-400 to-red-500" : reward.type === "rare" ? "from-blue-400 to-indigo-500" : "from-slate-500 to-slate-700";

        items.push(
          <div
            key={`${set}-${idx}`}
            className={`flex-shrink-0 flex items-center justify-center text-2xl font-bold text-white bg-gradient-to-br ${typeColor} backdrop-blur-md border border-white/10 shadow-inner`}
            style={{
              width: `${itemWidth}px`,
              height: "100px",
              margin: `0 ${itemMargin}px`,
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-800 via-slate-900 to-black text-white">
      <h1 className="text-4xl font-extrabold mb-6 tracking-tight text-white drop-shadow-lg">🎡 Lucky Spin</h1>

      <div className="relative w-[600px] h-[120px] overflow-hidden border-4 border-yellow-400 rounded-xl bg-black/40 backdrop-blur-md shadow-2xl">
        {!spinning && showStaticRewards && <div className="absolute inset-0 flex items-center">{renderRewardItems()}</div>}
        <div
          ref={containerRef}
          className="flex absolute left-0 h-full items-center opacity-50"
          style={{
            paddingLeft: `${extraPadding}px`,
            paddingRight: `${extraPadding}px`,
            transform: `translateX(${centerPointerOffset}px)`,
          }}
        >
          {renderRewardItems()}
        </div>
        <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-yellow-500 animate-pulse"></div>
        </div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-r-4 border-b-2 border-l-transparent border-r-transparent border-b-rose-500"></div>
      </div>

      <button onClick={startSpin} disabled={buttonDisabled || spinning} className="mt-8 px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
        {spinning ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
                1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Spinning...
          </span>
        ) : (
          "Spin Now"
        )}
      </button>

      {reveal && selectedReward && <div className="mt-6 px-6 py-4 bg-gradient-to-r from-green-400 to-lime-500 text-white text-xl font-bold rounded-lg shadow-lg animate-pulse border border-white/20">🎉 You won: {selectedReward} 🎉</div>}
    </div>
  );
}
