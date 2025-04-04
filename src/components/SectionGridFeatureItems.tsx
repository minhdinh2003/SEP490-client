"use client";
import React, { FC, useEffect, useState } from "react";
import HeaderFilterSection from "@/components/HeaderFilterSection";
import ProductCard from "@/components/ProductCard";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { Product, PRODUCTS } from "@/data/data";
import http from "@/http/http";
import { handleErrorHttp } from "@/utils/handleError";
import ProductService from "@/http/productService";
import { ServiceResponse } from "@/type/service.response";
import { IPagingParam } from "@/contains/paging";
//
export interface SectionGridFeatureItemsProps {
  data?: Product[];
}

const SectionGridFeatureItems: FC<SectionGridFeatureItemsProps> = ({}) => {
  const [filter, setFilter] = useState({
    IsApproved: true,
    search: "",
    sort: "",
    maxPrice: "",
    minPrice: "",
  });
  const getParamPaging = (): IPagingParam => {
    const param: IPagingParam = {
      pageSize: 10000,
      pageNumber: 1,
      conditions: [],
      searchKey: "",
      searchFields: ["name"],
      includeReferences: {
        inventory: true,
      },
    };
    return param;
  };

  const [data, setData] = useState([]);
  const getData = async () => {
    const body = {
      PageSize: 10000,
      PageNumber: 1,
      Filter: "IsApproved=true ",
      SortOrder: filter.sort,
      SearchKey: "",
    };

    if (filter.minPrice) {
      body.Filter = body.Filter + ` and Price > ${filter.minPrice}`;
    }
    if (filter.maxPrice) {
      body.Filter = body.Filter + ` and Price < ${filter.maxPrice}`;
    }

    try {
      const res = await ProductService.getPaging<ServiceResponse>(
        getParamPaging()
      );
      setData(res.data.data);
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  useEffect(() => {
    getData();
  }, [filter]);
  return (
    <div className="nc-SectionGridFeatureItems relative">
      <HeaderFilterSection />
      <div
        className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}
      >
        {data && (
          <div>
            {data?.map((item, index) => (
              <ProductCard data={item} key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionGridFeatureItems;
