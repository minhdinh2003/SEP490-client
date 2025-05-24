"use client";

import React, { createRef, FC, useState } from "react";
import Logo from "@/shared/Logo/Logo";
import MenuBar from "@/shared/MenuBar/MenuBar";
import AvatarDropdown from "./AvatarDropdown";
import Navigation from "@/shared/Navigation/Navigation";
import CartDropdown from "./CartDropdown";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import NotyDropdown from "./NotyDropDown";
import WithHydration from "@/HOC/withHydration";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Link from "next/link";
import Cookies from "js-cookie";

export interface MainNav2LoggedProps {}

const MainNav2Logged: FC<MainNav2LoggedProps> = () => {
  // const authPath = ["/login","/signup"];
  const path = usePathname();
  const isNotAuPage = path !== "/login" && path !== "/signup";

  const inputRef = createRef<HTMLInputElement>();
  const [showSearchForm, setShowSearchForm] = useState(false);
  const router = useRouter();
  const authStore: any = useAuthStore();
  const isLogin = authStore.isLogin as boolean;
  const renderMagnifyingGlassIcon = () => {
    return (
      <svg
        width={22}
        height={22}
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
    );
  };

  const renderSearchForm = () => {
    return (
      <form
        className="flex-1 py-2 text-slate-900 dark:text-slate-100"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/collection?search=${inputRef?.current?.value}`);
          inputRef.current?.blur();
        }}
      >
        <div className="bg-slate-50 dark:bg-slate-800 flex items-center space-x-1.5 px-5 h-full rounded">
          {renderMagnifyingGlassIcon()}
          <input
            ref={inputRef}
            type="text"
            placeholder="Nhập tên sản phẩm"
            className="w-full text-base bg-transparent border-none focus:outline-none focus:ring-0"
            autoFocus
          />
          <button type="button" onClick={() => setShowSearchForm(false)}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <input type="submit" hidden value="" />
      </form>
    );
  };

  const renderContent = () => {
    return (
      <div className="flex justify-between h-20">
        <div className="flex items-center flex-1 lg:hidden">
          <MenuBar />
        </div>

        <div className="flex items-center lg:flex-1">
          {/* <Logo className="flex-shrink-0" /> */}
          <Link href={"/"}>
            {/* <div className="flex items-center justify-center">
       <Image className="mr-1" width={27} height={27} alt="" src={"/book8.svg"} />
       <span className="text-2xl font-bold">Booden</span>
       </div> */}
            <Logo />
          </Link>
        </div>

        <div className="flex-[5] hidden lg:flex justify-center mx-1">
          {showSearchForm ? renderSearchForm() : <Navigation />}
        </div>

        <div className="flex items-center justify-end text-slate-700 dark:text-slate-100">
          {!showSearchForm && (
            <button
              className="items-center justify-center hidden w-10 h-10 rounded-full lg:flex sm:w-12 sm:h-12 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              onClick={() => setShowSearchForm(!showSearchForm)}
            >
              {renderMagnifyingGlassIcon()}
            </button>
          )}

          {isLogin ? (
            <>
              <AvatarDropdown />
              <CartDropdown />
              <NotyDropdown />
            </>
          ) : (
            <div className="flex items-center gap-3">
              <ButtonPrimary
                onClick={() => {
                  Cookies.remove("token", { path: "/" });

                  router.push("/login");
                }}
                className="p-0"
              >
                Đăng nhập
              </ButtonPrimary>
              <ButtonSecondary href={"/signup"} className="p-0">
                Đăng ký
              </ButtonSecondary>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative z-10 bg-white border-b nc-MainNav2Logged dark:bg-neutral-900 border-slate-100 dark:border-slate-700">
      {isNotAuPage && <div className="container ">{renderContent()}</div>}
    </div>
  );
};

export default WithHydration(MainNav2Logged);
