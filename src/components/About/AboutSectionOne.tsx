import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

const AboutSectionOne = () => {
  const List = ({ text }) => (
    <p className="mb-5 flex items-center text-lg font-medium text-body-color">
      <span className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
        {checkIcon}
      </span>
      {text}
    </p>
  );

  return (
    <section id="about" className="pt-8 md:pt-10 lg:pt-14">
      <div className="container">
        <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <SectionTitle
                title="Tại sao nên mua xe ô tô tại Shopcar?"
                paragraph="ShopCar tự hào là một trong những công ty hàng đầu trong việc trao đổi và mua bán xe ô tô cũ, xe ô tô đã qua sử dụng."
                mb="44px"
              />
              <div
                className="mb-12 max-w-[570px] lg:mb-0"
                data-wow-delay=".15s"
              >
                <div className="fs-12 ml-1 mx-[-12px] flex flex-wrap text-base text-body-color md:text-sm">
                  <p>
                    <strong>ShopCar VIETNAM </strong>tự hào là một trong những
                    công ty hàng đầu trong việc trao đổi và mua bán xe ô tô cũ,
                    xe ô tô đã qua sử dụng. <br />
                    <br />
                    <strong>Về sản phẩm</strong> ShopCar cung cấp rất nhiều các
                    dòng xe được ưa chuộng tại thị trường Việt Nam như: Sedan,
                    SUV, Crossover, MPV, Pickup, 9 chỗ, 16 chỗ đến từ các thương
                    hiệu KIA, Hyundai, Mazda, Toyota, Suzuki, Mitsubishi, MG,
                    Honda, Chevrolet, Ford, Nissan,... <br />
                    <strong>Về chất lượng </strong> ShopCar hoạt động với tiêu
                    chí 04 không: Không đâm đụng ảnh hưởng đến kết cấu khung
                    gầm, không thủy kích, không qua xử lý và không bị tai nạn.
                    Cam kết chất lượng đối với từng sản phẩm đến tay quý khách
                    hàng, những chiếc xe ô tô trước khi được xuất xưởng và trao
                    chìa khóa cho khách hàng đều được đội ngũ chuyên viên kỹ
                    thuật kiểm tra tỉ mỉ từng chi tiết nhằm mang đến trải nghiệm
                    sản phẩm tốt nhất cho khách hàng của mình.
                    <br />
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2">
              <div className="relative mx-auto aspect-[25/24] max-w-[550px] lg:mr-0">
                <Image
                  src="/images/about/home_img_1_1.jpg"
                  alt="about-image"
                  fill
                  className="mx-auto max-w-full drop-shadow-three dark:hidden dark:drop-shadow-none lg:mr-0"
                />
                <Image
                  src="/images/about/home_img_1_1.jpg"
                  alt="about-image"
                  fill
                  className="mx-auto hidden max-w-full drop-shadow-three dark:block dark:drop-shadow-none lg:mr-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionOne;
