import { StarIcon } from "@heroicons/react/24/solid";
import React, { FC, useState } from "react";
import Avatar from "@/shared/Avatar/Avatar";
import Image from "next/image";
import http from "@/http/http";
import toast from "react-hot-toast";
import { handleErrorHttp } from "@/utils/handleError";
import NcModal from "@/shared/NcModal/NcModal";
import FormReview from "@/app/product-detail/[id]/FormReview";

interface ReviewItemDataType {
  name: string;
  avatar?: string;
  date: string;
  comment: string;
  starPoint: number;
  id: number | string;
}

export interface ReviewItemProps {
  className?: string;
  data?: ReviewItemDataType;
  isMe?: Boolean;
  callback?: any;
  item?: any;
}

const ReviewItem: FC<ReviewItemProps> = ({
  className = "",
  data,
  isMe,
  callback = () => {},
  item,
}) => {
  console.log(data);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  // DELETE
  const handleDeleteReview = async () => {
    4;
    try {
      const res = await http.delete("review?id=" + data?.id);
      if (res.payload.Success) {
        toast.success("Đã xóa");
        callback();
      }
    } catch (error: any) {
      handleErrorHttp(error.payload);
    }
  };
  return (
    <div
      className={`nc-ReviewItem flex flex-col ${className}`}
      data-nc-id="ReviewItem"
    >
      <div className=" flex space-x-4 ">
        <div className="flex-shrink-0 pt-0.5">
          <Avatar
            sizeClass="h-10 w-10 text-lg"
            radius="rounded-full"
            userName={data?.name}
            imgUrl={data?.avatar}
          />
        </div>

        <div className="flex-1 flex justify-between">
          <div className="text-sm sm:text-base">
            <span className="block font-semibold">{data?.name}</span>
            <span className="block mt-0.5 text-slate-500 dark:text-slate-400 text-sm">
              {data?.date}
            </span>
            <div className="mt-0.5 flex text-yellow-500"></div>
          </div>

          <div className="mt-0.5 flex text-yellow-500">
            <div className="flex flex-col justify-center gap-2">
              <div className="mt-0.5 flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="cursor-pointer">
                    <svg
                      className="flex-shrink-0 size-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill={`${star <= data?.starPoint! ? "#facc15" : "gray"}`}
                      viewBox="0 0 16 16"
                    >
                      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                    </svg>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-1">
                {isMe && (
                  <div className="mt-1">
                    <Image
                      onClick={() => {
                        setOpenModalEdit(true);
                      }}
                      className="cursor-pointer"
                      alt=""
                      width={20}
                      height={20}
                      src={"/edit.svg"}
                    />
                  </div>
                )}
                {isMe && (
                  <div className="mt-1">
                    <Image
                      onClick={() => handleDeleteReview()}
                      className="cursor-pointer"
                      alt=""
                      width={20}
                      height={20}
                      src={"/delete.svg"}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 prose prose-sm sm:prose dark:prose-invert sm:max-w-2xl">
        <p className="text-slate-600 dark:text-slate-300">{data?.comment}</p>
      </div>
      {openModalEdit && (
        <NcModal
          isOpenProp={openModalEdit}
          onCloseModal={() => setOpenModalEdit(false)}
          renderContent={() => <FormReview callback={() => {
            callback();
            setOpenModalEdit(false)
          }} itemEdit={item} />}
          modalTitle="Sửa  đánh giá"
        />
      )}
    </div>
  );
};

export default ReviewItem;
