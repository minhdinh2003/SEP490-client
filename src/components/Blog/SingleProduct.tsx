import { Blog } from "@/type/blog";
import Image from "next/image";
import Link from "next/link";

const SingleProduct = ({ blog }: { blog: Blog }) => {
  const { title, image, paragraph, author, tags, publishDate } = blog;
  return (
    <>
      <div className="group relative transform overflow-hidden rounded-md bg-white shadow-md shadow-one transition-all duration-300 duration-300 hover:scale-105 hover:shadow-two hover:shadow-xl dark:bg-dark dark:hover:shadow-gray-dark">
        <Link
          href="/blog-details"
          className="relative block aspect-[37/22] w-full"
        >
          {/* <span className="absolute right-6 top-6 z-20 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold capitalize text-white">
            {tags[0]}
          </span> */}
          <Image src={image} alt="image" fill />
        </Link>
        <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
          <h3>
            <Link
              href="/blog-details"
              className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
            >
              {title}
            </Link>
          </h3>
          <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
            Hà nội - 300 triệu
          </p>
          <div className="flex items-center space-x-6">
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-700">
                Năm sản xuất: 2014
              </div>
              <div className="text-sm text-gray-500">Số sàn</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-700">Màu: Bạc</div>
            </div>
          </div>
          <div className="flex items-center">
            <button className="w-full mt-2 rounded-lg bg-[#4A6CF7] px-6 py-3 font-medium text-white shadow-md transition duration-300 ease-in-out hover:bg-[#3a59e6]">
              Tìm xe
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
