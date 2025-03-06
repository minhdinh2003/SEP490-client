"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import CSS cơ bản
import "swiper/css/navigation"; // Import CSS cho nút next/prev
import { Navigation, Autoplay } from "swiper/modules";
//Import

const Carousel = () => {
  return (
    <div
      className="relative z-10 overflow-hidden bg-cover bg-center pb-[16px] pt-[16px] dark:bg-gray-dark"
      style={{
        backgroundColor: "#F5F5F5",
      }}
    >
      <div className="container relative z-10">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className=" w-full text-left">
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                spaceBetween={20}
                slidesPerView={7}
                loop
                style={{ height: "70px" }}
                autoplay={{
                  delay: 100000,
                  disableOnInteraction: false,
                }}
              >
                <SwiperSlide>
                  <div className="flex h-full cursor-pointer items-center justify-center rounded-lg font-bold text-black hover:text-red-500">
                    <div className="flex h-full flex-col items-center">
                      <img
                        src="https://cms.anycar.vn/wp-content/uploads/2022/09/7f46bd9d-20220912_065451-150x150.png"
                        alt="Slide 3"
                        className="h-[50px] w-[50px]"
                      />
                      <div className=" text-center">Ford</div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="flex h-full cursor-pointer items-center justify-center rounded-lg font-bold text-black hover:text-red-500">
                    <div className="flex h-full flex-col items-center">
                      <img
                        src="https://cms.anycar.vn/wp-content/uploads/2022/09/a27430db-20220912_065450-150x150.png"
                        alt="Slide 3"
                        className="h-[50px] w-[50px]"
                      />
                      <div className=" text-center">HONDA</div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="flex h-full cursor-pointer items-center justify-center rounded-lg font-bold text-black hover:text-red-500">
                    <div className="flex h-full flex-col items-center">
                      <img
                        src="https://cms.anycar.vn/wp-content/uploads/2022/09/4946e88c-20220912_065439-1-150x150.png"
                        alt="Slide 3"
                        className="h-[50px] w-[50px]"
                      />
                      <div className=" text-center">NISSAN</div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="flex h-full cursor-pointer items-center justify-center rounded-lg font-bold text-black hover:text-red-500">
                    <div className="flex h-full flex-col items-center">
                      <img
                        src="https://cms.anycar.vn/wp-content/uploads/2022/09/bef4d2d3-20220912_065440-150x150.png"
                        alt="Slide 3"
                        className="h-[50px] w-[50px]"
                      />
                      <div className=" text-center">PEUGEOT</div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="flex h-full cursor-pointer items-center justify-center rounded-lg font-bold text-black hover:text-red-500">
                    <div className="flex h-full flex-col items-center">
                      <img
                        src="https://cms.anycar.vn/wp-content/uploads/2022/09/ecfb47a1-20220912_071121-150x150.png"
                        alt="Slide 3"
                        className="h-[50px] w-[50px]"
                      />
                      <div className=" text-center">Ssangyong</div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="flex h-full cursor-pointer items-center justify-center rounded-lg font-bold text-black hover:text-red-500">
                    <div className="flex h-full flex-col items-center">
                      <img
                        src="https://cms.anycar.vn/wp-content/uploads/2022/09/7f46bd9d-20220912_065451-150x150.png"
                        alt="Slide 3"
                        className="h-[50px] w-[50px]"
                      />
                      <div className=" text-center">Ford</div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="flex h-full cursor-pointer items-center justify-center rounded-lg font-bold text-black hover:text-red-500">
                    <div className="flex h-full flex-col items-center">
                      <img
                        src="https://cms.anycar.vn/wp-content/uploads/2022/09/5dabec2b-20220912_065438-150x150.png"
                        alt="Slide 3"
                        className="h-[50px] w-[50px]"
                      />
                      <div className=" text-center">Suzuki</div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="flex h-full cursor-pointer items-center justify-center rounded-lg font-bold text-black hover:text-red-500">
                    <div className="flex h-full flex-col items-center">
                      <img
                        src="https://cms.anycar.vn/wp-content/uploads/2022/09/7f46bd9d-20220912_065451-150x150.png"
                        alt="Slide 3"
                        className="h-[50px] w-[50px]"
                      />
                      <div className=" text-center">Vinfast</div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="flex h-full cursor-pointer items-center justify-center rounded-lg font-bold text-black hover:text-red-500">
                    <div className="flex h-full flex-col items-center">
                      <img
                        src="https://cms.anycar.vn/wp-content/uploads/2022/09/a59a2886-20220912_065437-150x150.png"
                        alt="Slide 3"
                        className="h-[50px] w-[50px]"
                      />
                      <div className=" text-center">Toyota</div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="flex h-full cursor-pointer items-center justify-center rounded-lg font-bold text-black hover:text-red-500">
                    <div className="flex h-full flex-col items-center">
                      <img
                        src="https://cms.anycar.vn/wp-content/uploads/2022/09/7f46bd9d-20220912_065451-150x150.png"
                        alt="Slide 3"
                        className="h-[50px] w-[50px]"
                      />
                      <div className=" text-center">Ford </div>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
