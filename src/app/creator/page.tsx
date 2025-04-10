"use client";
import HeaderFilterSearchPage from "@/components/HeaderFilterSearchPage";
import { useGetData } from "@/hooks/useGetData";
import http from "@/http/http";
import ButtonCircle from "@/shared/Button/ButtonCircle";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import NcImage from "@/shared/NcImage/NcImage";
import { formatAddress, getAddress } from "@/utils/helpers";
import Link from "next/link";
import { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const ListCreator = () => {
  const [selectedFilter, setSelectedFilter] = useState<any>([]);
  const [textSearch,setTextSearch] = useState("");
  const { data: listCategory } = useGetData("Category/all");
  const filters = listCategory.map((i: any) => ({
    name: i.Name,
    id: i.CategoryID,
  }));
  const [listCreator, setListCreator] = useState([]);

  const works = [
    {
      title: "ジャニ子解体新書①",
      author: "コーポ",
      image: "/images/work1.jpg",
    },
    {
      title: "ジャニ子解体新書②",
      author: "コーポ",
      image: "/images/work2.jpg",
    },
    {
      title: "おはようストリートマップ",
      author: "ポ〜ン",
      image: "/images/work3.jpg",
    },
    { title: "新人賞", author: "ぐってぃ", image: "/images/work4.jpg" },
    { title: "小話_まとめ", author: "ふに・無9", image: "/images/work5.jpg" },
    {
      title: "今日ももう帰ろうね",
      author: "ふに・無9",
      image: "/images/work6.jpg",
    },
  ];

  //
  const handeSelectedFilter = (id: any) => {
    const index = selectedFilter?.indexOf(id);
    if (index < 0) {
      setSelectedFilter([...selectedFilter, id]);
      return;
    } else {
      const newSelected = [...selectedFilter];
      newSelected.splice(index, 1);
      setSelectedFilter(newSelected);
    }
  };

  const getCreator = async () => {
    try {
      const cates = selectedFilter.join(";");
      
      const res = await http.get(
        `User/creator-policy?pageSize=${10000}&pageNumber=${1}&categoryIDs=${cates}`
      );
      let data = res?.payload?.Data || []
      if(textSearch?.trim()){
     
        data = data.filter((item:any)=>{
          const name =  item?.FirstName + " " + item?.LastName;
          return name?.toUpperCase().includes(textSearch?.trim()?.toUpperCase());
        } )
      }
      setListCreator(data);
    } catch (error) {}
  };
  useEffect(() => {
    getCreator();
  }, [selectedFilter]);
  return (
    <div className={`nc-PageCollection`}>
      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
        <div className="space-y-10 lg:space-y-14">
          <div className="max-w-screen-sm ">
            <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Nhà sáng tạo
            </h2>
            <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
              Tìm nhà sáng tạo phù hợp với yêu cầu của bạn
            </span>
          </div>
          <hr className="border-slate-200 dark:border-slate-700" />
          <header style={{
            marginTop:-35
          }} className="max-w-2xl mx-auto -mt-10 flex flex-col lg:-mt-7">
            <div className="relative w-full mb-5">
              <label
                htmlFor="search-input"
                className="text-neutral-500 dark:text-neutral-300"
              >
                {/* <span className="sr-only">Search all icons</span> */}
                <Input
                  value={textSearch}
                  className="shadow-lg border-0 dark:border"
                  id="search-input"
                  type="search"
                  placeholder="Tên nhà sáng tạo"
                  sizeClass="pl-14 py-5 pr-5 md:pl-16"
                  rounded="rounded-full"
                  onChange={(e) => setTextSearch(e.target.value)}
                />
                <ButtonCircle
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
                  size=" w-11 h-11"
                  onClick={() => {
                    getCreator()
                  }}
                >
                  <i className="las la-arrow-right text-xl"></i>
                </ButtonCircle>
                <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl md:left-6">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 22L20 20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </label>
            </div>
          </header>
          <div className="flex justify-start mb-2 flex-wrap gap-2">
            <ButtonPrimary
              className="w-auto  flex justify-start"
              // sizeClass="pl-4 py-2.5 sm:pl-6"
            >
              <svg
                className={`w-4 h-4 sm:w-6 sm:h-6`}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M14.3201 19.07C14.3201 19.68 13.92 20.48 13.41 20.79L12.0001 21.7C10.6901 22.51 8.87006 21.6 8.87006 19.98V14.63C8.87006 13.92 8.47006 13.01 8.06006 12.51L4.22003 8.47C3.71003 7.96 3.31006 7.06001 3.31006 6.45001V4.13C3.31006 2.92 4.22008 2.01001 5.33008 2.01001H18.67C19.78 2.01001 20.6901 2.92 20.6901 4.03V6.25C20.6901 7.06 20.1801 8.07001 19.6801 8.57001"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.07 16.52C17.8373 16.52 19.27 15.0873 19.27 13.32C19.27 11.5527 17.8373 10.12 16.07 10.12C14.3027 10.12 12.87 11.5527 12.87 13.32C12.87 15.0873 14.3027 16.52 16.07 16.52Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.87 17.12L18.87 16.12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="block truncate ml-2.5">Danh mục</span>
            </ButtonPrimary>

            {filters.map((filter: any) => (
              <button
                key={filter.id}
                className={`py-1 px-6 rounded-full ${
                  selectedFilter.indexOf(filter.id) >= 0
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => handeSelectedFilter(filter.id)}
              >
                {filter.name}
              </button>
            ))}
          
          </div>
          <hr className="border-slate-200 dark:border-slate-700" />
          {listCreator.length === 0 && (
            <div className="text-gray-500 text-center pt-52">
              Không có nhà sáng tạo nào phù hợp
            </div>
          )}
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-4  pt-3">
            {listCreator.map((work: any, index: any) => (
              <>
                <div
                  className={`nc-ProductCard relative flex flex-col bg-transparent `}
                >
                  <div className="relative flex-shrink-0 bg-slate-50 dark:bg-slate-300 rounded-3xl overflow-hidden z-1 group">
                    <Link href={`/creator/${work.UserID}`} className="block">
                      <NcImage
                        containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0"
                        src={work.ImageAvatar || "/avt.svg"}
                        className="object-cover w-full h-full drop-shadow-xl"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 40vw"
                        alt="product"
                      />
                    </Link>
                  </div>

                  <div className="space-y-4 px-2.5 pt-5 pb-2.5">
                    <div>
                      <h2 className="nc-ProductCard__title text-2xl font-semibold transition-colors">
                        {work?.FirstName + " " + work?.LastName}
                      </h2>
                      <p
                        className={`text-lg text-slate-500 dark:text-slate-400 mt-1 `}
                      >
                        {formatAddress(work?.Address)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCreator;
