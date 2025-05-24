import Logo from "@/shared/Logo/Logo";
import SocialsList1 from "@/shared/SocialsList1/SocialsList1";
import { CustomLink } from "@/data/types";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export type WidgetFooterMenu = any;
const widgetMenus: WidgetFooterMenu[] = [
  // {
  //   id: "5",
  //   title: "Getting started",
  //   menus: [
  //     { href: "/", label: "Release Notes" },
  //     { href: "/", label: "Upgrade Guide" },
  //     { href: "/", label: "Browser Support" },
  //     { href: "/", label: "Dark Mode" },
  //   ],
  // },
  {
    id: "1",
    title: "Chính sách",
    menus: [
      { href: "/", label: "Chính sách đổi trả" },
      { href: "/", label: "Bảo mật thông tin" },
      { href: "/", label: "Chính sách giao nhận" },
    ],
  },
  {
    id: "2",
    title: "Liên hệ",

    menus: [
      {
        href: "/",
        label: (
          <SocialsList1 className="flex items-center space-x-2 lg:space-x-0 lg:flex-col lg:space-y-3 lg:items-start" />
        ),
      },
    ],
  },
  {
    id: "3434",
    title: "Chức năng",
    menus: [
      { href: "/", label: "Mua bán sản phẩm" },
      { href: "/", label: "Đấu giá" },
      { href: "/", label: "Yêu cầu sản phẩm riêng" },
    ],
  },
];

const Footer: React.FC = () => {
  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm">
        <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">
          {menu.title}
        </h2>
        <ul className="mt-5 space-y-4">
          {menu.menus.map((item: any, index: any) => (
            <li key={index}>
              <a
                key={index}
                className="text-neutral-6000 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="relative py-5 border-t nc-Footer lg:pt-28 lg:pb-12 border-neutral-200 dark:border-neutral-700">
      <div className="container grid grid-cols-2 gap-y-10 gap-x-5 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10 ">
        <div className="grid grid-cols-4 col-span-2 gap-5 md:col-span-4 lg:md:col-span-1 lg:flex lg:flex-col">
          <div className="col-span-2 md:col-span-1">
            <Link href={"/"}>
              <div className="flex items-center justify-center">
                <Logo />
              </div>
            </Link>
          </div>
          <div className="flex items-center col-span-2 md:col-span-3"></div>
        </div>
        {widgetMenus.map(renderWidgetMenuItem)}
      </div>
    </div>
  );
};

export default Footer;
