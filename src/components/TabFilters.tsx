"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@/app/headlessui";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonThird from "@/shared/Button/ButtonThird";
import ButtonClose from "@/shared/ButtonClose/ButtonClose";
import Checkbox from "@/shared/Checkbox/Checkbox";
import Slider from "rc-slider";
import Radio from "@/shared/Radio/Radio";
import { useGetData } from "@/hooks/useGetData";

const PRICE_RANGE = [0, 5000000000];

const DATA_sortOrderRadios = [
  { name: "Giá từ thấp đến cao", id: "Price asc" },
  { name: "Giá từ cao đến thấp", id: "Price desc" },
];

const TabFilters = ({ filter, setFilter }: any) => {
  const [isOpenMoreFilter, setIsOpenMoreFilter] = useState(false);

  const { data: listCategory } = useGetData("brand/all");
  const [rangePrices, setRangePrices] = useState([0, 5000000000]);
  const [categoriesState, setCategoriesState] = useState<string[]>([]);
  const [sortOrderStates, setSortOrderStates] = useState<string>("");

  const closeModalMoreFilter = () => setIsOpenMoreFilter(false);
  const openModalMoreFilter = () => setIsOpenMoreFilter(true);

  useEffect(() => {
    
    if (isOpenMoreFilter) {
      setSortOrderStates(filter.sort);
      setRangePrices([filter.minPrice || 0, filter.maxPrice || PRICE_RANGE[1]]);
      console.log(filter.categories)
      setCategoriesState(filter.categories)
    }
  }, [isOpenMoreFilter]);

  const handleChangeCategories = (checked: boolean, id: any) => {
    let data = categoriesState.filter((i) => i !== id);
    if (checked){
      data.push(id);
    }
    setCategoriesState(data);
  };

  const renderXClear = () => {
    return (
      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-500 text-white flex items-center justify-center ml-3 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  };

  const renderMoreFilterItem = (
    data: {
      name: string;
      description?: string;
      defaultChecked?: boolean;
      id: any;
    }[]
  ) => {
    const list1 = data.filter((_, i) => i < data.length / 2);
    const list2 = data.filter((_, i) => i >= data.length / 2);

    const handleChange = handleChangeCategories;

    return (
      <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-8">
        <div className="flex flex-col space-y-5">
          {list1.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              subLabel={item.description}
              label={item.name}
              defaultChecked={categoriesState.indexOf(item.id) >= 0}
              onChange={(e: any) => {
                handleChange(e, item.id);
              }}
            />
          ))}
        </div>
        <div className="flex flex-col space-y-5">
          {list2.map((item) => (
            <Checkbox
              onChange={(e: any) => {
                handleChange(e, item.id);
              }}
              key={item.name}
              name={item.name}
              subLabel={item.description}
              label={item.name}
              defaultChecked={categoriesState.indexOf(item.id) >= 0}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderTabMobileFilter = () => {
    return (
      <div className="flex-shrink-0">
        <div
          className={`flex flex-shrink-0 items-center justify-center px-4 py-2 text-sm rounded-full border border-primary-500 bg-primary-50 text-primary-900 focus:outline-none cursor-pointer select-none`}
          onClick={openModalMoreFilter}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 6.5H16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6.5H2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 10C11.933 10 13.5 8.433 13.5 6.5C13.5 4.567 11.933 3 10 3C8.067 3 6.5 4.567 6.5 6.5C6.5 8.433 8.067 10 10 10Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 17.5H18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 17.5H2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 21C15.933 21 17.5 19.433 17.5 17.5C17.5 15.567 15.933 14 14 14C12.067 14 10.5 15.567 10.5 17.5C10.5 19.433 12.067 21 14 21Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="ml-2">Lọc sản phẩm</span>
          {renderXClear()}
        </div>

        <Transition appear show={isOpenMoreFilter} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={closeModalMoreFilter}
          >
            <div className="min-h-screen text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60"
                />
                </Transition.Child>
  
                <span
                  className="inline-block h-screen align-middle"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Transition.Child
                  className="inline-block h-screen w-full max-w-4xl"
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div className="inline-flex flex-col w-full text-left align-middle transition-all transform bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 h-full">
                    <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Lọc sản phẩm
                      </Dialog.Title>
                      <span className="absolute left-3 top-3">
                        <ButtonClose onClick={closeModalMoreFilter} />
                      </span>
                    </div>
  
                    <div className="flex-grow overflow-y-auto">
                      <div className="px-6 sm:px-8 md:px-10 divide-y divide-neutral-200 dark:divide-neutral-800">
                        <div className="py-7">
                          <h3 className="text-xl font-medium">
                            Hãng xe
                          </h3>
                          <div className="mt-6 relative">
                            {renderMoreFilterItem(listCategory)}
                          </div>
                        </div>
                        <div className="py-7">
                          <h3 className="text-xl font-medium">Khoảng giá</h3>
                          <div className="mt-6 relative">
                            <div className="relative flex flex-col space-y-8">
                              <div className="space-y-5">
                                <Slider
                                  range
                                  className="text-red-400"
                                  min={PRICE_RANGE[0]}
                                  max={PRICE_RANGE[1]}
                                  defaultValue={rangePrices}
                                  allowCross={false}
                                  onChange={(_input: number | number[]) =>
                                    setRangePrices(_input as number[])
                                  }
                                />
                              </div>
                              <div className="flex justify-between space-x-5">
                                <div>
                                  <label
                                    htmlFor="minPrice"
                                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                                  >
                                    Giá thấp nhất
                                  </label>
                                  <div className="mt-1 relative rounded-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <span className="text-neutral-500 sm:text-sm"></span>
                                    </div>
                                    <input
                                      type="text"
                                      name="minPrice"
                                      disabled
                                      id="minPrice"
                                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-neutral-200 rounded-full text-neutral-900"
                                      value={rangePrices[0]}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label
                                    htmlFor="maxPrice"
                                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                                  >
                                    Giá cao nhất
                                  </label>
                                  <div className="mt-1 relative rounded-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <span className="text-neutral-500 sm:text-sm"></span>
                                    </div>
                                    <input
                                      type="text"
                                      disabled
                                      name="maxPrice"
                                      id="maxPrice"
                                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-neutral-200 rounded-full text-neutral-900"
                                      value={rangePrices[1]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="py-7">
                          <h3 className="text-xl font-medium">Sắp xếp</h3>
                          <div className="mt-6 relative">
                            <div className="relative flex flex-col space-y-5">
                              {DATA_sortOrderRadios.map((item) => (
                                <Radio
                                  id={item.id}
                                  key={item.id}
                                  name="radioNameSort"
                                  label={item.name}
                                  defaultChecked={sortOrderStates === item.id}
                                  onChange={setSortOrderStates}
                                  defauttValue={sortOrderStates}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex-shrink-0 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                      <ButtonThird
                        onClick={() => {
                          setRangePrices(PRICE_RANGE);
                          setCategoriesState([]);
                          setSortOrderStates("");
                          setFilter({
                            ...filter,
                            sort: "",
                            maxPrice: PRICE_RANGE[1],
                            minPrice: PRICE_RANGE[0],
                            categories: []
                          });
                          closeModalMoreFilter();
                        }}
                        sizeClass="px-4 py-2 sm:px-5"
                      >
                        Xóa
                      </ButtonThird>
                      <ButtonPrimary
                        onClick={() => {
                          setFilter({
                            ...filter,
                            sort: sortOrderStates,
                            maxPrice: rangePrices[1],
                            minPrice: rangePrices[0],
                            categories: categoriesState
                          });
                          closeModalMoreFilter();
                        }}
                        sizeClass="px-4 py-2 sm:px-5"
                      >
                        Áp dụng
                      </ButtonPrimary>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
        </div>
      );
    };
  
    return (
      <div className="flex lg:space-x-4">
        {/* FOR DESKTOP */}
        <div className="hidden lg:flex flex-1 space-x-4"></div>
  
        {/* FOR RESPONSIVE MOBILE */}
        <div className="flex overflow-x-auto space-x-4">
          {renderTabMobileFilter()}
        </div>
      </div>
    );
  };
  
  export default TabFilters;
  