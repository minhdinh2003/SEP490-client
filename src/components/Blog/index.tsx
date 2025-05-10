"use client";
import { IPagingParam } from "@/contains/paging";
import SectionTitle from "../Common/SectionTitle";
import SingleProduct from "./SingleProduct";
import blogData from "./blogData";
import { useEffect, useState } from "react";
import ProductService from "@/http/productService";
import { ServiceResponse } from "@/type/service.response";
import { handleErrorHttp } from "@/utils/handleError";
import ProductCard from "../ProductCard";
import Link from "next/link";

const Blog = () => {
  const [data, setData] = useState([]);
  const [visibleItems, setVisibleItems] = useState(3);
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
      searchKey: "",
      searchFields: ["name"],
      includeReferences: {
        inventory: true,
      },
    };

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
  }, []);
  return (
    <section
      id="blog"
      className="bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle title="Sản phẩm xe" paragraph="" center />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {data.slice(0, visibleItems).map((item, index) => (
            <div key={index} className="w-full">
              <ProductCard data={item} />
            </div>
          ))}
        </div>

        {/* Nút "Xem thêm" */}
        {data.length > visibleItems && (
          <div className="flex justify-center mt-8">
            <Link href={"/collection"} className="">
              <button className="bg-blue-700 text-white py-2 px-4 rounded-full hover:bg-blue-600 mt-4 px-6 py-2 bg-primary text-slate-900 dark:text-slate-200 rounded-md hover:bg-primary-dark transition duration-300">
                Xem thêm
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
