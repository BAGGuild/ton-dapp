"use client"

import { useState, useEffect } from 'react';
import { useUser } from "../context/UserContext";
import { addToast } from '@heroui/toast';
import { Avatar, Button, Code } from '@heroui/react';
import Image from 'next/image';
import { fetchClaimData, fetchClaimPost, fetchUserData } from '@/utils/apiClient';
import { Roboto_Mono } from "next/font/google";

const robotoMonoBold = Roboto_Mono({
  weight: '600',
  subsets: ['latin'],
  variable: '--font-roboto-mono-bold',
});

export default function Home() {
  const { userData, setUserData } = useUser();
  const [claimInfo, setClaimInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1);

  useEffect(() => {
    async function getClaimData() {
      try {
        const data = await fetchClaimData();
        setClaimInfo(data);
      } catch (error) {
        console.error("Error fetching claim data:", error);
        addToast({
          title: "Error during fetching data",
          color: "danger",
          severity: "danger",
        });
      }
    }
    getClaimData();
  }, []);

  useEffect(() => {
    if (!claimInfo || !claimInfo.next_claim_time) return;
    const nextClaimTime = new Date(claimInfo.next_claim_time).getTime();

    const intervalId = setInterval(() => {
      const now = Date.now();
      const diff = nextClaimTime - now;
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [claimInfo]);

  const handleClaim = async () => {
    if(timeLeft > 0) return;
    
    setLoading(true);
    try {
      const data = await fetchClaimPost();
      const data2 = await fetchClaimData();
      setClaimInfo(data2);
      addToast({
        title: "Claim successful!",
        description: `Points: ${data.awarded_points},\n New streak: ${data.new_streak}`,
        promise: new Promise((resolve) => setTimeout(resolve, 1000)),
        severity: "success",
      });
      const userResponse = await fetchUserData();
      setUserData(userResponse);
    } catch (error) {
      console.error("Error during claim:", error);
      addToast({
        title: "Error during claim",
        color: "danger",
        severity: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const isButtonDisabled = loading || timeLeft > 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      
      <div className="bg-default-100/50 w-[90%] rounded-lg p-4 mt-4 border border-default-100">
        <div className="flex items-center gap-4">
          <Avatar
            src={userData?.photo_url}
            alt={userData?.username || "Guest"}
            size="lg"
            isBordered
            className="flex-shrink-0"
          />
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-lg font-bold">
                {userData?.username || "Guest"}
              </h2>
              <Code color="success" className={`text-sm border border-green-600 px-3 ${robotoMonoBold.className} `}>x1.0</Code>
            </div>
            <p className="text-gray-400">
              <span className="flex items-center gap-2 text-3xl">
                {Number(userData?.total_points || 0).toLocaleString("en-US")}
                <Image src="/assets/white.png" alt="Nomad" width={22} height={22} />
              </span>
            </p>
          </div>
        </div>
      </div>

      <Image
        src="/assets/logo.png"
        alt="Daily"
        width={150}
        height={150}
        className="object-cover mt-4"
        unoptimized
      />

      <div className="relative flex flex-col items-start justify-center mt-4 bg-default-100/50 w-[90%] mx-auto rounded-lg p-4 border border-default-100">
        <div className="absolute top-2 right-2 w-12 h-12">
          <Image
            src="/assets/daily.webp"
            alt="Daily"
            width={50}
            height={50}
            className="object-cover"
          />
        </div>

        <h3 className="text-xl font-bold mb-6">Daily Nomad</h3>
        <hr className="w-full border-t border-default-100" />
        {claimInfo ? (
          <div className="w-full space-y-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">Current Streak:</span>
              <span className="text-md font-semibold">{Number(claimInfo.current_streak).toLocaleString("en-US")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">Next Claim Points:</span>
              <span className="text-md font-semibold">{Number(claimInfo.next_claim_points).toLocaleString("en-US")}</span>
            </div>

            <Button
              onPress={handleClaim}
              isDisabled={isButtonDisabled}
              className="mt-4 w-full rounded-sm"
              variant="shadow"
            >
              {loading
                ? "Processing..."
                : timeLeft > 0
                ? `Claim in ${formatTime(timeLeft)}`
                : `Claim Now (Day ${
                    claimInfo.streak_reset ? 1 : Number(claimInfo.current_streak) + 1
                  })`}
            </Button>
          </div>
        ) : (
          <p>Loading claim info...</p>
        )}
      </div>
    </div>
  );
}