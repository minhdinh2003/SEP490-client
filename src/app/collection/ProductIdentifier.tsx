"use client";
import ProductCard from "@/components/ProductCard";
import TabFilters from "@/components/TabFilters";
import ButtonCircle from "@/shared/Button/ButtonCircle";
import Input from "@/shared/Input/Input";
import { handleErrorHttp } from "@/utils/handleError";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TabPro from "./TabPro";
import ProductService from "@/http/productService";
import { ServiceResponse } from "@/type/service.response";
import { IPagingParam } from "@/contains/paging";
const ProductIdentifier = (context: any) => {
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
          value: "PART",
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
                category: "PART",
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
    <div className="space-y-10 lg:space-y-14">
      <main>
        <div className="container">
          <header
            style={{
              marginTop: -90,
            }}
            className="max-w-2xl mx-auto -mt-10 flex flex-col lg:-mt-7"
          >
            <div className="relative w-full mb-5">
              <label
                htmlFor="search-input"
                className="text-neutral-500 dark:text-neutral-300"
              >
                <Input
                  value={text!}
                  onChange={(e) => setText(e.target.value)}
                  className="shadow-lg  border"
                  id="search-input"
                  type="search"
                  placeholder="Tên phụ tùng"
                  sizeClass="pl-14 py-5 pr-5 md:pl-16"
                  rounded="rounded-full"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      getData();
                    }
                  }}
                />
                <ButtonCircle
                  onClick={() => getData()}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
                  size=" w-11 h-11"
                >
                  <i className="las la-arrow-right text-xl"></i>
                </ButtonCircle>
                <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl md:left-6">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 22L20 20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </label>
            </div>
          </header>
        </div>
        <TabFilters filter={filter} setFilter={setFilter} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-10 mt-8 lg:mt-10">
          {data?.map((item: any, index: number) => (
            <ProductCard data={item} key={index} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductIdentifier;
