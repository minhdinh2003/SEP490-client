"use client";
import React, { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { Brand } from "@/models/base.model";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
export interface DataProps {
  brands: Brand[];
}
const BrandList: FC<DataProps> = ({ brands }) => {
  const router = useRouter();
  return (
    <div
      className="relative z-10 overflow-hidden bg-cover bg-center pb-[16px] pt-[16px] dark:bg-gray-dark"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      <div className="container relative z-10">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="w-full text-left">
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                spaceBetween={20}
                slidesPerView={7}
                loop
                style={{ height: "70px" }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
              >
                {brands.map((brand: Brand, index) => (
                  <SwiperSlide key={index}>
                    <Link href={`/collection?brand=${brand.id}`}>
                      <div className="flex h-full cursor-pointer items-center justify-center rounded-lg font-bold text-black hover:text-red-500">
                        <div className="flex h-full flex-col items-center">
                          <img
                            src={brand.logoURL}
                            alt={brand.name}
                            className="h-[50px] w-[50px]"
                          />
                          <div className="text-center">{brand.name}</div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandList;
