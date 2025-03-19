"use client"

import HistoryTable from "@/components/profile/historyTable";
import { useUser } from "@/context/UserContext";
import { Avatar, Card, CardBody, Code, Tab, Tabs } from '@heroui/react';
import { FaRegCopy, FaCheck } from "react-icons/fa6";
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const { userData } = useUser();
  const [isCopied, setIsCopied] = useState(false);

  const referralLink = `https://t.me/BagDappBot/Dapp?startapp=${userData.ref_code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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
              <Code color="success" className='text-sm border border-green-600 px-3'>x1.0</Code>
            </div>
            <p className="text-gray-400">
              <span className="flex items-center gap-2 text-3xl">
                {Number(userData?.total_points || 0).toLocaleString("en-US")}
                <Image src="/assets/white.png" alt="Nomad" width={22} height={22} />
              </span>
            </p>
          </div>
        </div>
          <div className="mt-6 flex flex-col items-center">
          <h4 className="text-white text-md font-bold mb-2 mt-3 self-start">
            Referral Link
          </h4>
          <div className="flex items-center w-full max-w-md bg-white/10 rounded-lg p-1">
            <span className="flex-1 text-white text-sm truncate px-2">
              {referralLink}
            </span>
            <button
              onClick={handleCopy}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-md flex items-center justify-center"
              aria-label="Copy Referral Link"
            >
              {isCopied ? (
                <FaCheck size={20} />
              ) : (
                <FaRegCopy size={20} />
              )}
            </button>
          </div>
          <h6 className="text-default-400 text-xs font-bold mb-2 mt-3 self-start">
            You will receive 10% of your referral's earnings
          </h6>
        </div>
      </div>

      <Tabs aria-label="Tabs variants" variant={"bordered"} className="mt-4">
          <Tab key="history" title="History" >
            <Card>
              <CardBody>
                <HistoryTable history={userData?.history} />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="referrals" title="Referrals" />
      </Tabs>
    </div>
  );
}