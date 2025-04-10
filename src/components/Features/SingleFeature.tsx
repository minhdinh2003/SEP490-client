import { Brand } from "@/type/brand";
import Image from "next/image";
import Link from "next/link";
const SingleFeature = ({ data }: { data: Brand }) => {
  const { logoURL } = data;
  return (
    <div className="w-full">
      <div
        className="wow fadeInUp items-center justify-center flex"
        data-wow-delay=".15s"
      >
        <div className="cursor-pointer mb-2 flex h-[100px] w-[100px] items-center justify-center rounded-md text-primary">
          <Link href={`/collection?brand=${data.id}`} className={`header-logo block w-full`} >
            <Image
              src={logoURL}
              alt="logo"
              width={120}
              height={70}
              className="w-full dark:hidden"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleFeature;
