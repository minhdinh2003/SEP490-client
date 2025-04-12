"use client";
import SharePost from "@/components/Blog/SharePost";
import TagButton from "@/components/Blog/TagButton";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PromotionService from "@/http/promotionService";
import { ServiceResponse } from "@/type/service.response";
import toast from "react-hot-toast";

const BlogDetailsPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [promotion, setPromotion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Thêm state loading

  useEffect(() => {
    const fetchPromotion = async () => {
      setIsLoading(true); // Bắt đầu loading
      try {
        const response = await PromotionService.getById<ServiceResponse>(
          parseInt(id + "")
        );
        if (response.success) {
          setPromotion(response.data);
        } else {
          toast.error("Lấy dữ liệu thất bại");
        }
      } catch (error) {
        console.error("Error fetching promotion:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setIsLoading(false); // Kết thúc loading dù thành công hay thất bại
      }
    };

    if (id) {
      fetchPromotion();
    }
  }, [id]);

  // Nếu đang loading, hiển thị thông báo loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-bold text-gray-500">Loading...</p>
      </div>
    );
  }

  // Nếu không có dữ liệu sau khi load xong, hiển thị thông báo lỗi
  if (!promotion) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-bold text-red-500">
          Không tìm thấy dữ liệu khuyến mãi!
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="pb-[120px] pt-[30px]">
        <div className="container mx-auto">
          {/* Sử dụng CSS Grid để tạo layout */}
          <div className="flex  relative">
            {/* Cột trái: Quảng cáo (Sticky) */}
            <div className="flex hidden md:block h-full relative ">
              <Image
                src="/advertisement_1.jpg" // Đường dẫn đến hình ảnh quảng cáo
                alt="Quảng cáo trái"
                width={100} // Kích thước chiều rộng
                height={500} // Kích thước chiều cao
                className="w-full h-auto rounded-lg shadow-lg h-[500px] sticky"
              />
            </div>

            {/* Cột giữa: Nội dung chính */}
            <div className="w-[calc(100%-256px)] col-span-1 md:col-span-1 px-4">
              <div>
                <h4 className="flex justify-center mb-8 text-2xl font-bold leading-tight text-black dark:text-white sm:text-3xl sm:leading-tight">
                  {promotion.name}
                </h4>

                <div>
                  <div
                    dangerouslySetInnerHTML={{ __html: promotion.content }}
                  />
                  <div className="items-center justify-between sm:flex">
                    <div className="mb-5">
                      <h4 className="mb-3 text-sm font-medium text-body-color">
                        Popular Tags :
                      </h4>
                      <div className="flex items-center">
                        <TagButton text="Design" />
                        <TagButton text="Development" />
                        <TagButton text="Info" />
                      </div>
                    </div>
                    <div className="mb-5">
                      <h5 className="mb-3 text-sm font-medium text-body-color sm:text-right">
                        Share this post :
                      </h5>
                      <div className="flex items-center sm:justify-end">
                        <SharePost />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Quảng cáo (Sticky) */}
            <div className="hidden md:block sticky top-[100px]">
              <Image
                src="/advertisement_2.jpg" // Đường dẫn đến hình ảnh quảng cáo
                alt="Quảng cáo phải"
                width={100} // Kích thước chiều rộng
                height={300} // Kích thước chiều cao
                className="w-full h-auto rounded-lg shadow-lg h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetailsPage;