"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchLeaderboardData } from "@/utils/apiClient";
import { Avatar, Card, CardBody, Spinner } from "@heroui/react";

export default function Home() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchLeaderboardData();
        console.log(data);
        setLeaderboard(data);
      } catch (error) {
        console.error("Error loading leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>
      {loading ? (
        <div className="flex justify-center items-center mt-[30vh]">
          <Spinner variant="dots" />
        </div>
      ) : (
        <div className="w-full space-y-4">
          {leaderboard.map((entry) => (
            <Card key={entry.ranking} className="">
              <CardBody>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    #{entry.ranking}
                    <Avatar
                      src={entry.photo_url}
                      alt={entry.username}
                      size="md"
                      isBordered
                    />
                    <span className="ml-2 font-semibold">{entry.username.slice(0,10)}</span>
                    <span className="ml-2 text-sm text-gray-500">x1</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 font-bold">
                      {Number(entry.combinedpoints).toLocaleString("en-US")}
                    </span>
                    <Image
                      src="/assets/white.png"
                      alt="Nomad"
                      width={18}
                      height={18}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}