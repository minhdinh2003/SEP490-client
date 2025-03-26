"use client";

import { CardPolicy } from "@/app/(request-product)/policy-list/CardPolicy";
import { useGetData } from "@/hooks/useGetData";
import http from "@/http/http";
import { formatPriceVND } from "@/utils/helpers";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Card = ({ title, description, categories, price,cate }: any) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg ">
        
      {/* <div className="mb-4 text-gray-700">
        Accepting {categories.join(" , ")} requests
      </div> */}
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center justify-between font-semibold">
          <div className="mb-4 text-gray-700">
         {cate}
         </div>
      </div>
        {/* <button className="bg-gray-800 text-white py-2 px-4 rounded-full">
            Check terms
          </button> */}
        <div className="text-gray-700">Mức giá: {formatPriceVND(price)}</div>
      </div>
  );
};

const PolicyInfo = () => {
  const [cardsData, setCardData] = useState([]);
  const [listCategory, setListCategory] = useState<any>([]);
  useGetData("Category/all", [], setListCategory);
  
  const { id } = useParams();
  const getListPoli = async () => {
    try {
      const res = await http.post("productRequest/policies/users", [id]);
      setCardData(res.payload.Data);
    } catch (error: any) {
      // handleErrorHttp(error?.payload)
    }
  };
  useEffect(() => {
    getListPoli();
  }, []);
  //   const cardsData = [
  //     {
  //       title: "Illustrations / Ugoira Terms",
  //       description: "éfd dfd dfd",
  //       categories: ["Illustrations", "Ugoira"],
  //       price: "5,000",
  //     },
  //     {
  //       title: "Illustrations / Ugoira / Manga Terms",
  //       description: "ww",
  //       categories: ["Illustrations", "Ugoira", "Manga"],
  //       price: "5,000",
  //     },
  //     {
  //       title: "dfdfd",
  //       description: "I'm trying out the Request feature...",
  //       categories: ["Illustrations", "Ugoira", "Manga", "Novels"],
  //       price: "5,000",
  //     },
  //   ];
  const getCategoryName = (categories:any) => {
    const arrCate = categories?.split(";")
    if(arrCate?.length === 0){
        return "";
    }
    return listCategory?.filter((i:any) => arrCate?.includes(i?.CategoryID?.toString())).map((i:any) => i.Name).join(" / ")
  }

  return (
    <div className="min-h-screen bg-white p-10">
      <div className="flex justify-between items-center mb-6"></div>
      <div className="">
        {cardsData.map((card:any, index) => (
          <CardPolicy
          key={index}
           cate={getCategoryName(card?.CategoryIDs)}
           title={card?.Title}
           des={card?.Description}
           price={card?.Price}
          />
        ))}
      </div>
    </div>
  );
};

export default PolicyInfo;
