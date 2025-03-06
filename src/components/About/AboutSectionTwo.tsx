import Image from "next/image";

const AboutSectionTwo = () => {
  return (
    <section className="py-8 md:py-10 lg:py-14">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div
              className="relative mx-auto mb-12 aspect-[25/24] max-w-[550px] text-center lg:m-0"
              data-wow-delay=".15s"
            >
              <Image
                src="/images/about/home_img_2.jpg"
                alt="about image"
                fill
                className="drop-shadow-three dark:hidden dark:drop-shadow-none"
              />
              <Image
                src="/images/about/home_img_2.jpg"
                alt="about image"
                fill
                className="hidden drop-shadow-three dark:block dark:drop-shadow-none"
              />
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[470px]">
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  DỊCH VỤ SỬA CHỮA, BẢO DƯỠNG VÀ BẢO HIỂM XE Ô TÔ TẠI ShopCar.
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-sm sm:leading-relaxed">
                  Sở hữu hệ thống nhà xưởng rộng rãi, máy móc công nghệ cao và
                  đội ngũ chuyên viên kỹ thuật có nhiều kinh nghiệm trong việc
                  bảo dưỡng, sửa chữa và chăm sóc xe ô tô - Anycar tự hào là nơi
                  cung cấp các dịch vụ sửa chữa và bảo dưỡng xe ô tô tốt nhất
                  hiện nay tại Việt Nam.
                </p>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-sm sm:leading-relaxed">
                  <strong>Các dịch vụ sửa chữa, bảo dưỡng</strong> có tại Anycar
                  bao gồm: Kiểm tra tình trạng xe, sửa chữa và đại tu xe, gò
                  phục hồi thân vỏ, sơn công nghệ cao và thay thế phụ tùng chính
                  hãng. Các công việc trên được thực hiện bởi các chuyên viên kỹ
                  thuật, các kỹ sư được đào tạo bài bản và làm việc trong một
                  môi trường năng động, chuyên nghiệp.
                </p>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-sm sm:leading-relaxed">
                  Ngoài ra Anycar còn có{" "}
                  <strong>các dịch vụ chăm sóc xe ô tô cao cấp </strong> phục vụ
                  cho nhu cầu của quý khách hàng như: Phủ Ceramic, phủ thủy
                  tinh, vệ sinh xe cao cấp, phủ gầm chống ồn chống gỉ, đánh
                  bóng, hiệu chỉnh mặt sơn, dán phim cách nhiệt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;
