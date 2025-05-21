"use client";

import BagIcon from "@/components/BagIcon";
import NcInputNumber from "@/components/NcInputNumber";
import Prices from "@/components/Prices";
import ReviewItem from "@/components/ReviewItem";
import detail1JPG from "@/images/products/detail1.jpg";
import detail2JPG from "@/images/products/detail2.jpg";
import detail3JPG from "@/images/products/detail3.jpg";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { StarIcon } from "@heroicons/react/24/solid";
// import Image from "next/image";
import { Image } from "antd";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ModalViewAllReviews from "./ModalViewAllReviews";
import Policy from "./Policy";
import { useParams, useRouter } from "next/navigation";
import { usePostData } from "@/hooks/useGetData";
import { Transition } from "@headlessui/react";
import { handleErrorHttp } from "@/utils/handleError";
import { ResponError } from "@/type/ResponseType";
import useCartStore from "@/store/useCartStore";
import { getUrlImage } from "@/utils/helpers";
import FormReview from "./FormReview";
import useAuthStore from "@/store/useAuthStore";
import useCheckoutStore from "@/store/useCheckoutStorage";
import { IPagingParam } from "@/contains/paging";
import OrderService from "@/http/orderService";
import { ServiceResponse } from "@/type/service.response";

const LIST_IMAGES_DEMO = [detail1JPG, detail2JPG, detail3JPG];

const ProductDetailPage = ({ isQuickView = false, id }: any) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const cartStore = useCartStore();
  const checkoutStore = useCheckoutStore();
  const params = useParams();
  const router = useRouter();
  const userStore: any = useAuthStore();
  const { user } = userStore;
  const [reget, setReget] = useState(1);
  const finalId = id || params.id;
  const [listOrder, setListOrder] = useState([]);
  const { data }: any = usePostData(
    `product/${finalId}/reference`,
    {
      inventory: true,
      brands: true,
      review: {
        include: {
          user: true,
        },
      },
    },
    [finalId, reget]
  );
  const getListOrder = async () => {
    const param: IPagingParam = {
      pageSize: 1000,
      pageNumber: 1,
      conditions: [
        {
          key: "userId",
          condition: "equal",
          value: user.id,
        },
        {
          key: "status",
          condition: "equal",
          value: "SHIPPED",
        },
      ],
      searchKey: "",
      searchFields: [],
      includeReferences: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    };
    const response = await OrderService.getPaging<ServiceResponse>(param);
    setListOrder(response.data.data);
  };
  useEffect(() => {
    getListOrder();
  }, []);

  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);
  useEffect(() => {
    if (data?.review && Array.isArray(data.review)) {
      // Tính ReviewCount
      const count = data.review.length;
      setReviewCount(count);

      // Tính AverageRating
      if (count > 0) {
        const totalRating = data.review.reduce(
          (sum: number, item: any) => sum + (item.rating || 0),
          0
        );
        const average = totalRating / count;
        setAverageRating(average);
      } else {
        setAverageRating(null); // Không có đánh giá nào
      }
    } else {
      // Nếu không có dữ liệu review
      setReviewCount(0);
      setAverageRating(null);
    }
  }, [data]);

  const [Quantity, setQuantity] = useState(1);

  const { mainImage, listImage } = getUrlImage(data?.listImage);
  const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] =
    useState(false);

  const getPartTypeName = (value: any) => {
    switch (value) {
      case "ENGINE":
        return "Động cơ";
      case "TRANSMISSION":
        return "Hộp số";
      case "BRAKE_SYSTEM":
        return "Hệ thống phanh";
      case "SUSPENSION":
        return "Hệ thống treo";
      case "ELECTRICAL":
        return "Hệ thống điện";
      case "COOLING_SYSTEM":
        return "Hệ thống làm mát";
      case "EXHAUST_SYSTEM":
        return "Hệ thống xả";
      case "BODY_PARTS":
        return "Phần thân xe";
      case "INTERIOR":
        return "Nội thất";
      case "EXTERIOR":
        return "Ngoại thất";
      case "TIRES_WHEELS":
        return "Lốp và bánh xe";
      case "LIGHTING":
        return "Hệ thống chiếu sáng";
      case "FILTERS":
        return "Lọc";
      case "BELTS":
        return "Dây đai";
      case "BATTERIES":
        return "Ắc quy";
      case "BELTS":
        return "Dây đai";
      case "STEERING":
        return "Hệ thống lái";
      case "AIR_CONDITIONING":
        return "Hệ thống điều hòa";
      case "SAFETY":
        return "An toàn";
      default:
        return "Khác";
    }
  };
  const renderProductCartOnNotify = () => {
    return (
      <div className="flex ">
        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={mainImage}
            alt={data?.name}
            className="absolute object-cover object-center w-20 h-[96px]"
            width={80}
            height={96}
          />
        </div>

        <div className="ms-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">{data?.name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span></span>
                  <span className="mx-2 border-s border-slate-200 dark:border-slate-700 h-4"></span>
                </p>
              </div>
              <Prices price={data?.price} className="mt-0.5" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <div className="flex">
              <button
                type="button"
                className="font-medium text-primary-6000 dark:text-primary-500 "
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/cart");
                }}
              >
                Xem danh sách yêu thích
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const getStatusClass = (status: any) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-500 text-white px-4 py-2 rounded ml-1 font-semibold";
      case "SOLD":
        return "bg-red-500 text-white px-4 py-2 rounded ml-1 font-semibold";
      case "OUT_OF_STOCK":
        return "bg-yellow-500 text-white px-4 py-2 rounded ml-1 font-semibold";
      default:
        return "";
    }
  };
  const formatDate = (dateString: string | Date): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  // Get Product Detail
  const notifyAddTocart = async () => {
    try {
      await cartStore.addItemToCart({
        productId: data?.id,
        userId: user.id,
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
          id: String(params.id) || "product-detail",
          duration: 3000,
        }
      );
    } catch (error: any) {
      handleErrorHttp(error.payload as ResponError);
    }
  };

  const renderSectionContent = () => {
    return (
      <div className="space-y-7 2xl:space-y-8">
        {/* ---------- 1 HEADING ----------  */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold">{data?.name}</h2>

          <div className="flex items-center mt-5 space-x-4 sm:space-x-5">
            {/* <div className="flex text-xl font-semibold">$112.00</div> */}
            <Prices
              contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold"
              price={data?.price}
            />

            <div className="h-7 border-l border-slate-300 dark:border-slate-700"></div>

            <div className="flex items-center">
              <a
                href="#reviews"
                className="flex items-center text-sm font-medium"
              >
                <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
                <div className="ml-1.5 flex">
                  <span>{averageRating}</span>
                  <span className="block mx-2">·</span>
                  <span className="text-slate-600 dark:text-slate-400 underline">
                    {reviewCount} đánh giá
                  </span>
                </div>
              </a>
              <span className="hidden sm:block mx-2.5">·</span>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="">
            <span className="text-sm font-medium">
              Số lượng còn lại:
              <span className="ml-1 font-semibold">
                {data?.inventory?.quantity}
              </span>
            </span>
          </label>
        </div>
        <div>
          <label htmlFor="">
            <div className="text-sm font-medium flex items-center">
              Trạng thái:
              <span
                className={getStatusClass(
                  data?.inventory?.quantity == 0 ? "SOLD" : "AVAILABLE"
                )}
              >
                {data?.inventory?.quantity == 0 ? "Hết hàng" : "Có sẵn"}
              </span>
            </div>
          </label>
        </div>
        {/* <div>
          <label htmlFor="">
            <div className="text-sm font-medium flex items-center">
              Địa chỉ:
              <span className="ml-1 font-semibold">{data?.address}</span>
            </div>
          </label>
        </div> */}
        {!isQuickView && (
          <div className="flex flex-col space-y-1 gap-5 ">
            <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
              <NcInputNumber defaultValue={Quantity} onChange={setQuantity} />
            </div>
            <div className="flex gap-3">
              <ButtonPrimary
                className="flex-1 flex-shrink-0"
                onClick={() => {
                  if (Quantity > data?.inventory?.quantity) {
                    toast.error("Số lượng sản phẩm còn lại không đủ");
                    return;
                  }
                  (checkoutStore as any).setProductCheckout([
                    {
                      ProductID: finalId,
                      Quantity,
                      Price: data?.price,
                      Images: data?.listImage,
                    },
                  ]);
                  router.push("/checkout");
                }}
                disabled={data?.inventory?.quantity == 0}
              >
                <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
                <span className="ml-3">Mua ngay</span>
              </ButtonPrimary>
              <ButtonSecondary
                className="flex-1 flex-shrink-0"
                onClick={notifyAddTocart}
              >
                <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
                <span className="ml-3"> Thêm vào danh sách yêu thích</span>
              </ButtonSecondary>
            </div>
          </div>
        )}

        {/*  */}
        <hr className=" 2xl:!my-10 border-slate-200 dark:border-slate-700"></hr>
        {/*  */}

        {/* ---------- 5 ----------  */}

        {/* ---------- 6 ----------  */}
        <div className="hidden xl:block">
          <Policy />
        </div>
      </div>
    );
  };

  const renderDetailSection = () => {
    return (
      <div className="">
        <h2 className="text-2xl font-semibold">Chi tiết sản phẩm</h2>
        <div className="prose prose-sm sm:prose dark:prose-invert sm:max-w-4xl mt-7">
          <p>{data?.Description}</p>
        </div>
        {data?.category == "CAR" && (
          <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Thông số kỹ thuật</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Group 1: Thông số cơ bản */}
              <div className="grid grid-cols-5 p-4 border-b">
                <div className="col-span-1">
                  <strong>Dung tích động cơ</strong>
                </div>
                <div className="col-span-1">
                  <strong>Nhiên liệu</strong>
                </div>
                <div className="col-span-1">
                  <strong>Hộp số</strong>
                </div>
                <div className="col-span-1">
                  <strong>Chỉ số đồng hồ công tơ mét</strong>
                </div>
                <div className="col-span-1">
                  <strong>Màu xe</strong>
                </div>
              </div>
              <div className="grid grid-cols-5 p-4">
                <div className="col-span-1">{data?.engine_capacity}</div>
                <div className="col-span-1">{data?.fuel_type}</div>
                <div className="col-span-1">{data?.transmission}</div>
                <div className="col-span-1">{data?.mileage}</div>
                <div className="col-span-1">{data?.exterior_color}</div>
              </div>

              {/* Group 2: Thông tin bổ sung */}
              <div className="grid grid-cols-5 p-4 border-t border-b">
                <div className="col-span-1">
                  <strong>Màu nội thất</strong>
                </div>
                <div className="col-span-1">
                  <strong>Xuất xứ</strong>
                </div>
                <div className="col-span-1">
                  <strong>Năm sản xuất</strong>
                </div>
                <div className="col-span-1">
                  <strong>Số chỗ ngồi</strong>
                </div>
                <div className="col-span-1">
                  <strong>Số cửa</strong>
                </div>
              </div>
              <div className="grid grid-cols-5 p-4">
                <div className="col-span-1">{data?.interior_color}</div>
                <div className="col-span-1">{data?.origin}</div>
                <div className="col-span-1">{data?.year}</div>
                <div className="col-span-1">{data?.seats}</div>
                <div className="col-span-1">{data?.doors}</div>
              </div>

              {/* Group 3: Thông tin pháp lý */}
              <div className="grid grid-cols-5 p-4 border-t border-b">
                <div className="col-span-1">
                  <strong>Thời hạn đăng kiểm</strong>
                </div>
                <div className="col-span-1">
                  <strong>Thời hạn bảo hiểm</strong>
                </div>
                <div className="col-span-1">
                  <strong>% Sơn zin</strong>
                </div>
                <div className="col-span-2"></div>{" "}
                {/* Empty column for alignment */}
              </div>
              <div className="grid grid-cols-5 p-4">
                <div className="col-span-1">
                  {data?.registrationExpiry
                    ? formatDate(data.registrationExpiry)
                    : "N/A"}
                </div>
                <div className="col-span-1">
                  {data?.insuranceExpiry
                    ? formatDate(data.insuranceExpiry)
                    : "N/A"}
                </div>
                <div className="col-span-1">
                  {data?.originalPaintPercentage || "N/A"}
                </div>
                <div className="col-span-2"></div>{" "}
                {/* Empty column for alignment */}
              </div>

              {/* Group 4: Tình trạng xe */}
              <div className="grid grid-cols-5 p-4 border-t">
                <div className="col-span-1">
                  <strong>Tình trạng đâm đụng</strong>
                </div>
                <div className="col-span-1">
                  <strong>Tình trạng ngập nước</strong>
                </div>
                <div className="col-span-1">
                  <strong>Tình trạng động cơ</strong>
                </div>
                <div className="col-span-1">
                  <strong>Tình trạng hộp số</strong>
                </div>
                <div className="col-span-1"></div>{" "}
                {/* Empty column for alignment */}
              </div>
              <div className="grid grid-cols-5 p-4">
                <div className="col-span-1">
                  {data?.accidentDetails || "N/A"}
                </div>
                <div className="col-span-1">
                  {data?.floodDamageDetails || "N/A"}
                </div>
                <div className="col-span-1">
                  {data?.engineCondition || "N/A"}
                </div>
                <div className="col-span-1">
                  {data?.transmissionCondition || "N/A"}
                </div>
                <div className="col-span-1"></div>{" "}
                {/* Empty column for alignment */}
              </div>
            </div>
          </div>
        )}
        {data?.category == "PART" && (
          <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Thông tin</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-5 p-4 border-b">
                <div className="col-span-1">
                  <strong>Loại phụ tùng</strong>
                </div>
                <div className="col-span-1">
                  <strong>Hãng xe</strong>
                </div>
              </div>
              <div className="grid grid-cols-5 p-4">
                <div className="col-span-1">
                  {getPartTypeName(data?.partType)}
                </div>
                <div className="col-span-1">
                  {data?.brands?.map((x: any) => x.name).join("; ")}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderReviews = () => {
    return (
      <div className="">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold flex items-center">
          <StarIcon className="w-7 h-7 mb-0.5" />
          <span className="ml-1.5">
            {" "}
            {data?.AverageRating} · {data?.ReviewCount} Reviews
          </span>
        </h2>

        {/* comment */}
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 ">
            {data?.review?.slice(0, 4)?.map((item: any, index: number) => (
              <ReviewItem
                key={item?.userId}
                callback={() => setReget(reget + 1)}
                isMe={item?.userId == user.userId}
                data={{
                  id: item?.id,
                  comment: item?.comment,
                  date: item.createe,
                  starPoint: item?.rating,
                  name: item?.fullName,
                  avatar: item?.user.profilePictureURL,
                }}
                item={item}
              />
            ))}
          </div>

          {data?.review?.length > 4 && (
            <ButtonSecondary
              onClick={() => setIsOpenModalViewAllReviews(true)}
              className="mt-10 border border-slate-300 dark:border-slate-700 "
            >
              Xem thêm {data?.review?.length - 4} đánh giá
            </ButtonSecondary>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-ProductDetailPage `}>
      {/* MAIn */}
      <main className="container mt-5 lg:mt-11">
        <div className="lg:flex">
          {/* CONTENT */}
          <div className="w-full lg:w-[55%] ">
            {/* HEADING */}
            <div className="relative">
              <div className="aspect-w-16 relative">
                <div className="relative">
                  <Image
                    height={600}
                    width={"100%"}
                    src={listImage.length ? listImage[currentImageIndex] : ""}
                    alt={`Product Image ${currentImageIndex}`}
                    className="w-full h-[600px] object-cover shadow rounded-lg"
                  />
                  <div className="flex mt-4 overflow-x-auto space-x-2">
                    {listImage.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Thumbnail ${index}`}
                        className={`w-16 h-16 object-cover cursor-pointer rounded ${
                          currentImageIndex === index
                            ? "border-2 border-blue-500"
                            : "opacity-70"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* META FAVORITES */}
            </div>
            <div className="md:w-1/2 mb-6 md:mb-0"></div>
          </div>

          {/* SIDEBAR */}
          <div className="w-full lg:w-[45%] pt-10 lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
            {renderSectionContent()}
          </div>
        </div>

        {/* DETAIL AND REVIEW */}
        <div className="mt-12 sm:mt-16 space-y-10 sm:space-y-16">
          <div className="block xl:hidden">
            <Policy />
          </div>

          {renderDetailSection()}

          <hr className="border-slate-200 dark:border-slate-700" />

          {renderReviews()}
          <hr className="border-slate-200 dark:border-slate-700" />
          {!isQuickView &&
            listOrder?.length > 0 &&
            listOrder.findIndex(
              (order: any) => order.orderItems[0].productId == finalId
            ) >= 0 && (
              <FormReview
                callback={() => setReget(reget + 1)}
                ProductID={data?.id}
              />
            )}

          <hr className="border-slate-200 dark:border-slate-700" />
        </div>
      </main>

      {/* MODAL VIEW ALL REVIEW */}
      <ModalViewAllReviews
        list={data?.review}
        star={averageRating || 0}
        numberReview={reviewCount || 0}
        show={isOpenModalViewAllReviews}
        onCloseModalViewAllReviews={() => setIsOpenModalViewAllReviews(false)}
      />
    </div>
  );
};

export default ProductDetailPage;
