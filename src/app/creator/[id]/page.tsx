"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import CreateWoodenBookRequest from "./tabs/CreateRequest";
import http from "@/http/http";
import { useParams } from "next/navigation";
import { formatAddress } from "@/utils/helpers";
import PolicyInfo from "./tabs/Policy";
import useAuthStore from "@/store/useAuthStore";
import WithHydration from "@/HOC/withHydration";
import ProductCard from "@/components/ProductCard";
const ListProductCreator = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();

  const getData = async (init = false, txt = "") => {
    const body = {
      PageSize: 10000,
      PageNumber: 1,
      Filter: `UserID = ${id} `,
      SortOrder: "CreatedDate desc",
      SearchKey: "",
    };

    try {
      const res = await http.post<any>(`Product/paging`, body);
      let currentData = res.payload.Data?.Data;
      setData(currentData.filter((i: any) => i.ProductType == 0));
    } catch (error: any) {}
  };
  useEffect(() => {
    getData(true);
  }, [id]);
  return (
    <div>
      <div className="grid grid-cols-3 gap-x-8 gap-y-10 mt-8 lg:mt-10">
        {data?.map((item: any, index: number) => (
          <ProductCard data={item} key={index} />
        ))}
      </div>
    </div>
  );
};

// TabContent Component
const TabContent = ({ activeTab }: any) => {
  return (
    <div className="mt-4">
      {activeTab === "Chính sách sản phẩm" && <PolicyInfo />}
      {activeTab === "Tạo yêu cầu sản phẩm" && <CreateWoodenBookRequest />}
      {activeTab === "Sản phẩm" && <ListProductCreator />}
    </div>
  );
};

// Tabs Component
const Tabs = () => {
  const [activeTab, setActiveTab] = useState("Chính sách sản phẩm");
  const { id } = useParams();
  const userStorage: any = useAuthStore();
  const isMine = userStorage?.user?.UserID == id;

  const tabs = isMine
    ? ["Chính sách sản phẩm", "Sản phẩm"]
    : ["Chính sách sản phẩm", "Tạo yêu cầu sản phẩm", "Sản phẩm"];

  return (
    <div className="w-full max-w-4xl mt-8">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 text-center ${
              activeTab === tab ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <TabContent activeTab={activeTab} />
    </div>
  );
};

// Profile Component
const Profile = () => {
  const [info, setInfo] = useState<any>({});
  const { id } = useParams();
  const getInfo = async () => {
    try {
      const res = await http.get(`User/${id}`);
      setInfo(res.payload.Data);
    } catch (error) {}
  };
  useEffect(() => {
    getInfo();
  }, [id]);
  return (
    <div className="bg-white min-h-screen flex flex-col items-center p-4 mt-10">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-25 h-25 rounded-full">
              <img
                src={info.ImageAvatar || "/avt.svg"}
                alt="Profile Image"
                className="rounded-full w-[80px] h-[80px] object-cover"
              />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">
                {info?.FirstName + " " + info?.LastName}
              </h1>
              <p className="text-green-500">{info?.Email}</p>
              <p>{formatAddress(info?.Address)}</p>
            </div>
          </div>
        </div>
        {/* <p className="mt-4">呼吸するだけで絵が上手くなりたいです</p> */}
      </div>
      <Tabs />
    </div>
  );
};

// Home Page
function Home() {
  return (
    <div>
      <Profile />
    </div>
  );
}
export default WithHydration(Home);
