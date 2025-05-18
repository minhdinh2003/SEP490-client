"use client";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Image from "next/image";
import http from "@/http/http";

const Dashboard = () => {
  const currentDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [startDate, setStartDate] = useState(oneMonthAgo.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(currentDate.toISOString().split("T")[0]);
  const [revenueData, setRevenueData] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [numberBuyer, setNumberBuyer] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [numberOrder, setNumberOrder] = useState(0);

  useEffect(() => {
    fetchRevenueData(startDate + "T00:00:00", endDate + "T23:59:59");
  }, []);

  const fetchRevenueData = async (start: string, end: string) => {
    try {
      const res = await http.post("User/chart/revenue", {
        StartTime: start ,
        EndTime: end ,
        IsGetAll:false
      });

      const data = res.payload.Data;
      setNumberBuyer(data.NumberBuyer);
      setTotalRevenue(data.TotalRevenue);
      setNumberOrder(data.NumberOrder);

      const labels = data.RevenueByDate.map((item: any) => item.Date);
      const revenue = data.RevenueByDate.map((item: any) => item.TotalRevenue);

      setRevenueData({
        labels,
        datasets: [
          {
            label: "Doanh thu",
            data: revenue,
            fill: false,
            backgroundColor: "rgb(75, 192, 192)",
            borderColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  const handleStartDateChange = (e: any) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (newStartDate > endDate) {
      setEndDate(newStartDate);
    }
  };

  const handleEndDateChange = (e: any) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    if (newEndDate < startDate) {
      setStartDate(newEndDate);
    }
  };

  const handleFilterClick = () => {
    fetchRevenueData(startDate + "T00:00:00", endDate + "T23:59:59");
  };

  return (
    <div className="p-4 min-h-screen mx-32 pt-10">
      <h1 className="text-2xl font-bold mb-4">Thống kê doanh số</h1>
      <div className="my-4 mt-10 mb-10 shadow p-10">
        <h2 className="text-xl font-semibold mb-4">Lọc ngày</h2>
        <div className="flex items-center ">
          <div className="flex items-center">
            <label className="mr-2">Từ:</label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="p-2 border rounded"
              max={endDate}
            />
          </div>
          <div className="whitespace-pre-wrap">{"  ~ "}</div>
          <div className="flex items-center">
            <label className="mr-2">Đến:</label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="p-2 border rounded"
              min={startDate}
            />
          </div>
          <div className="flex items-center ml-5">
            <button
              className="py-2 bg-black text-[#fff] px-6 rounded-md"
              onClick={handleFilterClick}
            >
              Lọc
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shadow p-10">
        <div className="bg-white p-4 rounded shadow flex items-center gap-3 border-blue-600 border-l-4 rounded-md">
          <Image src={"/peo.svg"} width={60} height={60} alt="" />
          <div>
            <h2 className="text-xl font-semibold">Số lượng người mua</h2>
            <p className="text-3xl">{numberBuyer}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center gap-3 border-blue-600 border-l-4 rounded-md">
          <Image src="/mon1.svg" width={60} height={60} alt="" />
          <div>
            <h2 className="text-xl font-semibold">Tổng doanh thu</h2>
            <p className="text-3xl">{totalRevenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center gap-3 border-blue-600 border-l-4 rounded-md">
          <Image src={"/ca.svg"} width={60} height={60} alt="" />
          <div>
            <h2 className="text-xl font-semibold">Tổng đơn hàng</h2>
            <p className="text-3xl">{numberOrder}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-10 shadow p-10">
        <h2 className="text-xl font-semibold">Biểu đồ doanh thu</h2>
        <div className="bg-white p-4 rounded shadow w-full">
          <Line className="w-full" title="Doanh thu" data={revenueData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
