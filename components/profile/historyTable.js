"use client";

import Image from "next/image";

export default function HistoryTable({ history = [] }) {
  return (
    <div className="p-4">
      {history.map((item, index) => (
        <div key={index} className="flex justify-between items-center border-b border-gray-600 py-2 gap-4">
          <div>
            <div className="font-bold">{item.source}</div>
            <div className="text-xs text-gray-500">
              {new Date(item.date).toLocaleString("en-US")}
            </div>
          </div>
          <div className="text-right flex items-center gap-2">
            {item.points}
            <Image src="/assets/white.png" alt="Nomad" width={15} height={15} />
          </div>
        </div>
      ))}
    </div>
  );
}