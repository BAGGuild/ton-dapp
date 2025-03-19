"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardBody } from "@heroui/react";
import { fetchReferralsData } from "@/utils/apiClient";

export default function ReferralsTable() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchReferralsData();
        setReferrals(data);
      } catch (error) {
        console.error("Error loading referrals data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading referrals...</p>
      ) : (
        <div className="space-y-4">
          {referrals.map((item, index) => (
            <Card key={item.id || index} className="p-4">
              <CardBody>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Image
                      src={item.photo_url}
                      alt={item.username}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="ml-3">
                      <div className="font-bold">{item.username}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(item.create_time).toLocaleString("en-US")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{Number(item.total_points).toLocaleString("en-US")}</span>
                    <Image
                      src="/assets/white.png"
                      alt="Nomad"
                      width={22}
                      height={22}
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