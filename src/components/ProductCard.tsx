"use client";
import React, { FC, useState } from "react";
import Prices from "./Prices";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { Product, PRODUCTS } from "@/data/data";
import { StarIcon } from "@heroicons/react/24/solid";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import BagIcon from "./BagIcon";
import toast from "react-hot-toast";
import { Transition } from "@/app/headlessui";
import ModalQuickView from "./ModalQuickView";
import ProductStatus from "./ProductStatus";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NcImage from "@/shared/NcImage/NcImage";
import Image from "next/image";
import useCartStore from "@/store/useCartStore";
import { handleErrorHttp } from "@/utils/handleError";
import { ResponError } from "@/type/ResponseType";
import useAuthStore from "@/store/useAuthStore";

export interface ProductCardProps {
  className?: string;
  data?: Product;
  isLiked?: boolean;
}

const ProductCard: FC<any> = ({
  className = "",
  data = PRODUCTS[0],
  isLiked,
}) => {
  const {
    name,
    price: price,
    description: description,
    sizes,
    variants,
    variantType,
    status,
    listImage,
    AverageRating: rating,
    id,
    ReviewCount: numberOfReviews,
    ProductID,
    UserID,
    year,
    address,
  } = data;
  const [variantActive, setVariantActive] = useState(0);
  const [showModalQuickView, setShowModalQuickView] = useState(false);
  const router = useRouter();
  const cartStore = useCartStore();
  const userStore: any = useAuthStore();
  const isMine = userStore?.user?.UserID == UserID;
  let image = "";

  if (listImage.length > 0) {
    image = listImage[0];
  }

  const notifyAddTocart = async () => {
    try {
      await cartStore.addItemToCart({
        productId: data.id
      });
      toast.custom(
        (t) => (
          <Transition
            appear
            show={t.visible}
            className="p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200"
            enter="transition-all duration-150"
            enterFrom="opacity-0 translate-x-20"
            enterTo="opacity-100 translate-x-0"
            leave="transition-all duration-150"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 translate-x-20"
          >
            <p className="block text-base font-semibold leading-none">
              Đã thêm vào danh sách yêu thích!
            </p>
            <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
            {renderProductCartOnNotify()}
          </Transition>
        ),
        {
          position: "top-right",
          id: String(id) || "product-detail",
          duration: 3000,
        }
      );
    } catch (error: any) {
      handleErrorHttp(error.payload as ResponError);
    }
  };

  const renderProductCartOnNotify = () => {
    return (
      <div className="flex ">
        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={image}
            alt={name}
            className="absolute object-cover object-center w-20 h-[96px]"
            width={80}
            height={96}
          />
        </div>

        <div className="ms-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">{name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>
                    {/* {variants ? variants[variantActive].name : `Natural`} */}
                  </span>
                  <span className="mx-2 border-s border-slate-200 dark:border-slate-700 h-4"></span>
                  {/* <span>{size || "XL"}</span> */}
                </p>
              </div>
              <Prices price={price} className="mt-0.5" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400">Số lượng : 1</p>

            <div className="flex">
              <button
                type="button"
                className="font-medium text-primary-6000 dark:text-primary-500 "
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/cart");
                }}
              >
                Xem giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getBorderClass = (Bgclass = "") => {
    if (Bgclass.includes("red")) {
      return "border-red-500";
    }
    if (Bgclass.includes("violet")) {
      return "border-violet-500";
    }
    if (Bgclass.includes("orange")) {
      return "border-orange-500";
    }
    if (Bgclass.includes("green")) {
      return "border-green-500";
    }
    if (Bgclass.includes("blue")) {
      return "border-blue-500";
    }
    if (Bgclass.includes("sky")) {
      return "border-sky-500";
    }
    if (Bgclass.includes("yellow")) {
      return "border-yellow-500";
    }
    return "border-transparent";
  };

  const renderVariants = () => {
    if (!variants || !variants.length || !variantType) {
      return null;
    }

    if (variantType === "color") {
      return (
        <div className="flex space-x-1">
          {variants.map((variant: any, index: number) => (
            <div
              key={index}
              onClick={() => setVariantActive(index)}
              className={`relative w-6 h-6 rounded-full overflow-hidden z-10 border cursor-pointer ${
                variantActive === index
                  ? getBorderClass(variant.color)
                  : "border-transparent"
              }`}
              title={variant.name}
            >
              <div
                className={`absolute inset-0.5 rounded-full z-0 ${variant.color}`}
              ></div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex ">
        {variants.map((variant: any, index: number) => (
          <div
            key={index}
            onClick={() => setVariantActive(index)}
            className={`relative w-11 h-6 rounded-full overflow-hidden z-10 border cursor-pointer ${
              variantActive === index
                ? "border-black dark:border-slate-300"
                : "border-transparent"
            }`}
            title={variant.name}
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
    );
  };

  const renderGroupButtons = () => {
    return (
      <div className="absolute bottom-0 group-hover:bottom-4 inset-x-1 flex justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        {!isMine && (
          <ButtonPrimary
            className="shadow-lg"
            fontSize="text-xs"
            sizeClass="py-2 px-4"
            onClick={() => notifyAddTocart()}
          >
            <BagIcon className="w-3.5 h-3.5 mb-0.5" />
            <span className="ms-1">Thêm vào danh sách yêu thích</span>
          </ButtonPrimary>
        )}
        <ButtonSecondary
          className="ms-1.5 bg-white hover:!bg-gray-100 hover:text-slate-900 transition-colors shadow-lg"
          fontSize="text-xs"
          sizeClass="py-2 px-4"
          onClick={() => setShowModalQuickView(true)}
        >
          <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
          <span className="ms-1">Xem</span>
        </ButtonSecondary>
      </div>
    );
  };

  return (
    <>
      <div
        className={`nc-ProductCard relative flex flex-col bg-transparent group relative transform overflow-hidden rounded-md bg-white shadow-md shadow-one transition-all duration-300 duration-300 hover:scale-105 hover:shadow-two hover:shadow-xl dark:bg-dark dark:hover:shadow-gray-dark ${className}`}
      >
        <Link
          href={`/product-detail/${id}`}
          className="absolute inset-0"
        ></Link>

        <div className="relative flex-shrink-0 bg-slate-50 dark:bg-slate-300 rounded-3xl overflow-hidden z-1 group">
          <Link href={`/product-detail/${id}`} className="block">
            <NcImage
              containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0"
              src={image}
              className="object-cover w-full h-full drop-shadow-xl"
              fill
              sizes="(max-width: 640px) 40vw, (max-width: 1200px) 20vw, 20vw"
              alt="product"
            />
          </Link>
          <ProductStatus status={status} />
          {renderGroupButtons()}
        </div>

        <div className="space-y-4 px-2.5 pt-5 pb-2.5">
          <div>
            <h2
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
              className="nc-ProductCard__title text-base font-semibold transition-colors"
            >
              {name}
            </h2>
            <p
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
              className={`text-sm text-slate-500 dark:text-slate-400 mt-1 `}
            >
              {description}
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="space-y-1">
              {data.category == "CAR" && (
                <div className="text-sm font-medium text-gray-700">
                  Năm sản xuất: {year}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-end ">
            <Prices price={price} />
            <div className="flex items-center mb-0.5">
              {rating || 0}{" "}
              <StarIcon className="w-5 h-5 pb-[1px] text-amber-400" />
              <span className="text-sm ms-1 text-slate-500 dark:text-slate-400">
                ({numberOfReviews || 0} đánh giá)
              </span>
            </div>
          </div>
          {data.address && (
            <div className="text-slate-500 flex justify-start text-sm">
              <Image alt="" width={16} height={16} src={"/address10.svg"} />
              {address}
            </div>
          )}
        </div>
      </div>

      {/* QUICKVIEW */}
      <ModalQuickView
        id={ProductID}
        show={showModalQuickView}
        onCloseModalQuickView={() => setShowModalQuickView(false)}
      />
    </>
  );
};

export default ProductCard;
