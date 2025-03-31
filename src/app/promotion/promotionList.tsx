import { useRouter } from "next/navigation";
import Image from "next/image";
import { IPagingParam } from "@/contains/paging";
import PromotionService from "@/http/promotionService";
import { ServiceResponse } from "@/type/service.response";
import { useEffect, useState } from "react";

import {
    dateFormat2,
    getUrlImage,
    StatusOrderDetails,
    StatusOrder,
  } from "@/utils/helpers";
const PromotionList = () => {
  const router = useRouter();

  const [promotions, setList] = useState<any>([]);
  const getList = async () => {
    try {
      const param: IPagingParam = {
        pageSize: 1000,
        pageNumber: 1,
        conditions: [],
        searchKey: "",
        searchFields: [],
        includeReferences: {},
        sortOrder: "updatedAt desc",
      };
      const res = await PromotionService.getPaging<ServiceResponse>(param);
      setList(res.data?.data);
    } catch (error) {}
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="max-w mx-auto">
      <ul className="grid grid-cols-2 gap-4">
        {promotions.map((promotion: any) => (
          <li
            key={promotion.id}
            className="p-4 border rounded-lg flex items-center gap-4 cursor-pointer hover:bg-gray-100"
            onClick={() => {
              router.push(`/promotion/${promotion.id}`);
            }}
          >
            {promotion.image && promotion.image.length > 0 && (
              <Image
                src={promotion.image[0]}
                alt={promotion.name}
                width={80}
                height={80}
                className="w-20 h-20 object-cover"
              />
            )}

            {/* Thông tin khuyến mãi */}
            <div>
              <h4 className="font-bold">{promotion.name}</h4>
              <p>{promotion.description}</p>
              <p>
                Thời gian: {dateFormat2(promotion.startDate)} - {dateFormat2(promotion.endDate)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PromotionList;
