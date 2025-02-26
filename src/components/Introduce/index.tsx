import Link from "next/link";
//introduction
const Introduce = () => {
  return (
    <>
      <section
        id="home"
        className="relative z-10 overflow-hidden bg-[url('/images/bg/bg.jpg')] bg-cover bg-center pb-16 pt-[120px] dark:bg-gray-dark md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, black 0%, rgba(0, 0, 0, 0) 60%)",
          }}
        ></div>
        <div className="container relative z-10">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className=" max-w-[800px] text-left">
                <h1 className="mb-5 text-3xl font-bold leading-tight text-white dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                  Mua Bán, Ký Gửi Xe Ô tô Cũ
                </h1>
                <p className="mb-6 text-white !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
                  Dịch vụ tốt nhất, Giá bán hợp lý, Xe cũ có bảo hành.
                </p>
                <div className="flex flex-col items-left justify-left space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                  <Link
                    href=""
                    className="rounded-[8px] border border-gray-300 bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:border-primary hover:bg-primary/80"
                  >
                    Tìm mua xe
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Introduce;
