"use client";
import http from "@/http/http";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import useAuthStore from "@/store/useAuthStore";
import { handleErrorHttp } from "@/utils/handleError";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

const FormReview: FC<any> = ({ ProductID, callback = () => {}, itemEdit }) => {
  const userStore: any = useAuthStore();
  const { user } = userStore;
  const originData = {
    id: 0,
    productId: ProductID,
    userId: user.id,
    fullName: user?.fullName,
    rating: 5,
    comment: "",
  };
  const [dataPost, setDataPost] = useState(originData);
  useEffect(() => {
    if (itemEdit) {
      setDataPost(itemEdit);
    } else {
      setDataPost(JSON.parse(JSON.stringify(originData)));
    }
  }, [user, ProductID, itemEdit]);

  // SAVE COMMENT
  const handleSave = async () => {
    if (!dataPost?.comment?.trim()) {
      toast.error("Vui lòng nhập nội dung");
      return;
    }
    try {
      if (!itemEdit){
        await http.post("review", {
          productId: dataPost.productId,
          userId: dataPost.userId,
          fullName: dataPost.fullName,
          rating: dataPost.rating,
          comment: dataPost.comment
        })
      }
      else {
        await http.put("review", dataPost);
      }
      setDataPost(originData);
      callback();
      if (itemEdit) {
        toast.success("Đã sửa");
      }
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  const rating = [1, 2, 3, 4, 5].map((star) => (
    <div
      key={star}
      className="cursor-pointer"
      onClick={() => { setDataPost({ ...dataPost, rating: star })}}
    >
      <svg
        className="flex-shrink-0 size-5 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill={`${star <= dataPost.rating ? "#facc15" : "gray"}`}
        viewBox="0 0 16 16"
      >
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
      </svg>
    </div>
  ));

  return (
    <div className="flex mb-4 ">
      <div className="w-full max-w-xl bg-white rounded-lg px-4 pt-2">
        <div className="flex flex-col flex-wrap -mx-3 mb-6">
          <h2 className="text-2xl font-semibold">Đánh giá sản phẩm</h2>
          <div className="rating flex gap-1 my-4">{rating}</div>
          <div className="w-full md:w-full mb-2 mt-2">
            <textarea
              className="outline-none rounded border border-gray-400 leading-normal resize-none w-full h-24 py-2 px-3 font-medium placeholder-gray-700"
              name="body"
              placeholder="Nhập đánh giá "
              required
              value={dataPost?.comment}
              onChange={(e: any) =>
                setDataPost({ ...dataPost, comment: e.target.value })
              }
            ></textarea>
          </div>
          <div className="w-full flex items-start w-full px-3">
            <div className="flex items-start w-1/2 text-gray-700 px-2 mr-auto"></div>
            <div className="-mr-1">
              <ButtonPrimary onClick={() => handleSave()}>Đăng</ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FormReview;
