"use client"
import React, { useState } from "react";

const TabPro = ({activeTab,setActiveTab}:any) => {
  const handleTabClick = (tab:any) => {
    setActiveTab(tab);
  };

  return (
    <div className="border-b border-gray-300 bg-white">
      <div className="flex justify-center">
        {["Xe ô tô", "Phụ tùng"].map((tab,index) => (
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

export default TabPro;