"use client"
import React, { useState } from "react";

const TabAu = ({activeTab,setActiveTab}:any) => {
  const handleTabClick = (tab:any) => {
    setActiveTab(tab);
  };

  return (
    <div className="border-b border-gray-300 bg-white">
      <div className="flex justify-center">
        {["Sắp diễn ra", "Đang diễn ra", "Đã kết thúc"].map((tab,index) => (
          <div
            key={tab}
            onClick={() => handleTabClick(index)}
            className={`px-4 py-2 cursor-pointer font-semibold transition-all duration-300 ${
              activeTab == index
                ? "text-black border-b-2 border-pink-500"
                : "text-gray-500"
            }`}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabAu;