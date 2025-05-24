"use client";
import { handleErrorHttp } from "@/utils/handleError";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductService from "@/http/productService";
import { ServiceResponse } from "@/type/service.response";
import { IPagingParam } from "@/contains/paging";
import PromotionList from "./promotionList";
const PageCollection = (context: any) => {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const brand = searchParams.get("brand");
  const [text, setText] = useState(search || "");
  const [filter, setFilter] = useState({
    IsApproved: true,
    search,
    sort: "",
    maxPrice: "",
    minPrice: "",
    categories: brand ? [parseInt(brand)] : [],
    materials: [],
  });
  const [data, setData] = useState([]);
  const getParamPaging = (): IPagingParam => {
    const param: IPagingParam = {
      pageSize: 10000,
      pageNumber: 1,
      conditions: [
        {
          key: "category",
          condition: "equal",
          value: "CAR",
        },
      ],
      searchKey: text,
      searchFields: ["name"],
      includeReferences: {
        inventory: true,
      },
    };
    if (filter.categories && filter.categories.length > 0) {
      param.conditions = [
        {
          key: "any",
          condition: "raw",
          value: {
            AND: [
              {
                category: "CAR",
              },
              {
                brands: {
                  some: {
                    id: {
                      in: filter.categories,
                    },
                  },
                },
              },
            ],
          },
        },
      ];
    }

    return param;
  };
  const getData = async (init = false, txt = "") => {
    try {
      const res = await ProductService.getPaging<ServiceResponse>(
        getParamPaging()
      );
      let currentData = res.data?.data;
      setData(currentData);
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  useEffect(() => {
    getData(true);
  }, [filter]);

  useEffect(() => {
    setText(search!);
    getData(false, search!);
  }, [search]);

  useEffect(() => {
    setFilter({ ...filter, search });
  }, [search]);
  return (
    <div className={`nc-PageCollection`}>
      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
        <div className="space-y-10 lg:space-y-14">
          {/* HEADING */}
          <div className="max-w-screen-sm">
            <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Danh sách khuyến mại
            </h2>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />
          <main>
            <PromotionList />
          </main>
        </div>
      </div>
    </div>
  );
};

export default PageCollection;
