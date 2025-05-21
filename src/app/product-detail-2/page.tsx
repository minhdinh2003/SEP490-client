"use client";

import React, { useState } from "react";
import {
  NoSymbolIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import NcImage from "@/shared/NcImage/NcImage";
import ReviewItem from "@/components/ReviewItem";
import detail21JPG from "@/images/products/detail3-1.webp";
import detail22JPG from "@/images/products/detail3-2.webp";
import detail23JPG from "@/images/products/detail3-3.webp";
import detail24JPG from "@/images/products/detail3-4.webp";
import { PRODUCTS } from "@/data/data";
import IconDiscount from "@/components/IconDiscount";
import NcInputNumber from "@/components/NcInputNumber";
import BagIcon from "@/components/BagIcon";
import toast from "react-hot-toast";
import { StarIcon } from "@heroicons/react/24/solid";
import SectionSliderProductCard from "@/components/SectionSliderProductCard";
import NotifyAddTocart from "@/components/NotifyAddTocart";
import Image, { StaticImageData } from "next/image";
import LikeSaveBtns from "@/components/LikeSaveBtns";
import AccordionInfo from "@/components/AccordionInfo";
import Policy from "../product-detail/[id]/Policy";
import ListingImageGallery from "@/components/listing-image-gallery/ListingImageGallery";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Route } from "next";

const LIST_IMAGES_GALLERY_DEMO: (string | StaticImageData)[] = [
  detail21JPG,
  detail22JPG,
  detail23JPG,
  detail24JPG,
  "https://images.pexels.com/photos/3812433/pexels-photo-3812433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1127000/pexels-photo-1127000.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1778412/pexels-photo-1778412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/871494/pexels-photo-871494.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/2850487/pexels-photo-2850487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];
const PRICE = 108;

const ProductDetailPage2 = ({}) => {
  const { sizes, variants, status, allOfSizes, image } = PRODUCTS[0];
  //
  const router = useRouter();
  const thisPathname = usePathname();
  const searchParams = useSearchParams();
  const modal = searchParams?.get("modal");
  //
  const [variantActive, setVariantActive] = useState(0);
  const [sizeSelected, setSizeSelected] = useState(sizes ? sizes[0] : "");
  const [qualitySelected, setQualitySelected] = useState(1);
  const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] =
    useState(false);

  //
  const handleCloseModalImageGallery = () => {
    let params = new URLSearchParams(document.location.search);
    params.delete("modal");
    router.push(`${thisPathname}/?${params.toString()}` as Route);
  };
  const handleOpenModalImageGallery = () => {
    router.push(`${thisPathname}/?modal=PHOTO_TOUR_SCROLLABLE` as Route);
  };

  //
  const renderVariants = () => {
    if (!variants || !variants.length) {
      return null;
    }

    return (
      <div>
        <label htmlFor="">
          <span className="text-sm font-medium">
            Color:
            <span className="ml-1 font-semibold">
              {variants[variantActive].name}
            </span>
          </span>
        </label>
        <div className="flex mt-3">
          {variants.map((variant, index) => (
            <div
              key={index}
              onClick={() => setVariantActive(index)}
              className={`relative flex-1 max-w-[75px] h-10 sm:h-11 rounded-full border-2 cursor-pointer ${
                variantActive === index
                  ? "border-primary-6000 dark:border-primary-500"
                  : "border-transparent"
              }`}
            >
              <div
                className="absolute inset-0.5 rounded-full overflow-hidden z-0 bg-cover"
                style={{
                  backgroundImage: `url(${
                    // @ts-ignore
                    typeof variant.thumbnail?.src === "string"
                      ? // @ts-ignore
                        variant.thumbnail?.src
                      : typeof variant.thumbnail === "string"
                      ? variant.thumbnail
                      : ""
                  })`,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const notifyAddTocart = () => {
    toast.custom(
      (t) => (
        <NotifyAddTocart
          productImage={image}
          qualitySelected={qualitySelected}
          show={t.visible}
          sizeSelected={sizeSelected}
          variantActive={variantActive}
        />
      ),
      { position: "top-right", id: "nc-product-notify", duration: 3000 }
    );
  };

  

  const renderStatus = () => {
    if (!status) {
      return null;
    }
    const CLASSES =
      "text-sm flex items-center text-slate-700 text-slate-900 dark:text-slate-300";
    if (status === "New in") {
      return (
        <div className={CLASSES}>
          <SparklesIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      );
    }
    if (status === "50% Discount") {
      return (
        <div className={CLASSES}>
          <IconDiscount className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      );
    }
    if (status === "Sold Out") {
      return (
        <div className={CLASSES}>
          <NoSymbolIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      );
    }
    if (status === "limited edition") {
      return (
        <div className={CLASSES}>
          <ClockIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      );
    }
    return null;
  };



  return (
    <div className={`ListingDetailPage nc-ProductDetailPage2`}>
     
    </div>
  );
};

export default ProductDetailPage2;
