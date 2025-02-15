import { Brand } from "@/types/brand";
import Image from "next/image";
import brandsData from "./brandsData";
import SectionTitle from "../Common/SectionTitle";

const Brands = () => {
  return (
    <section className="pt-16">
      <div className="container">
        <SectionTitle
          title="Vì Sao Bạn Chọn ShopCar"
          paragraph=""
          center
          mb="10px"
        />
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="flex flex-wrap items-center justify-center rounded-sm bg-gray-light px-8 py-8 dark:bg-gray-dark 
            sm:px-10 md:px-[50px] md:py-[40px] xl:p-[50px] 2xl:px-[70px] 2xl:py-[60px]">
              {brandsData.map((brand) => (
                <SingleBrand key={brand.id} brand={brand} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;

const SingleBrand = ({ brand }: { brand: Brand }) => {
  const { image, imageLight, name, description } = brand;

  return (
    <div className="w-[200px] flex-1 items-center justify-center">
      <div className="w-[200px] flex flex-col items-center">
        <a
          target="_blank"
          rel="nofollow noreferrer"
          className="relative h-[70px] w-[70px] opacity-70 transition hover:opacity-100 dark:opacity-60 dark:hover:opacity-100"
        >
          <Image
            src={imageLight}
            alt={name}
            fill
            className="hidden dark:block "
          />
          <Image src={image} alt={name} fill className="block dark:hidden " />
        </a>
      </div>
      <div className="w-[200px] mt-2 text-center  break-words">{description}</div>
    </div>
  );
};
