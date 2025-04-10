import { NavItemType } from "@/shared/Navigation/NavigationItem";
import ncNanoId from "@/utils/ncNanoId";

export const LIST_CATEGORY_PRODUCT: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/#",
    name: "Category 1",
  },
  {
    id: ncNanoId(),
    href: "/#",
    name: "Category 2",
  },
  {
    id: ncNanoId(),
    href: "/#",
    name: "Category 3",
  },
  {
    id: ncNanoId(),
    href: "/#",
    name: "Category 4",
  },
];

const OTHER_PAGE_CHILD: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Home Demo 1",
  },
  {
    id: ncNanoId(),
    href: "/home-2",
    name: "Home Demo 2",
  },
  {
    id: ncNanoId(),
    href: "/collection",
    name: "Category Pages",
    type: "dropdown",
    children: [
      {
        id: ncNanoId(),
        href: "/collection",
        name: "Category page 1",
      },
      {
        id: ncNanoId(),
        href: "/collection-2",
        name: "Category page 2",
      },
    ],
  },
  {
    id: ncNanoId(),
    href: "/product-detail",
    name: "Product Pages",
    type: "dropdown",
    children: [
      {
        id: ncNanoId(),
        href: "/product-detail",
        name: "Product detail 1",
      },
      {
        id: ncNanoId(),
        href: "/product-detail-2",
        name: "Product detail 2",
      },
    ],
  },
  {
    id: ncNanoId(),
    href: "/cart",
    name: "Cart Page",
  },
  {
    id: ncNanoId(),
    href: "/checkout",
    name: "Checkout Page",
  },
  {
    id: ncNanoId(),
    href: "/search",
    name: "Search Page",
  },
  {
    id: ncNanoId(),
    href: "/account",
    name: "Account Page",
  },
  {
    id: ncNanoId(),
    href: "/about",
    name: "Other Pages",
    type: "dropdown",
    children: [
      {
        id: ncNanoId(),
        href: "/about",
        name: "About",
      },
      {
        id: ncNanoId(),
        href: "/contact",
        name: "Contact us",
      },
      {
        id: ncNanoId(),
        href: "/login",
        name: "Login",
      },
      {
        id: ncNanoId(),
        href: "/signup",
        name: "Signup",
      },
      {
        id: ncNanoId(),
        href: "/subscription",
        name: "Subscription",
      },
      { id: ncNanoId(), href: "/forgot-pass", name: "Forgot Password" },
    ],
  },
  {
    id: ncNanoId(),
    href: "/blog",
    name: "Blog Page",
    type: "dropdown",
    children: [
      {
        id: ncNanoId(),
        href: "/blog",
        name: "Blog Page",
      },
      {
        id: ncNanoId(),
        href: "/blog-single",
        name: "Blog Single",
      },
    ],
  },
];

export const NAVIGATION_DEMO_2: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Trang chủ",
    children: LIST_CATEGORY_PRODUCT,
  },
  {
    id: ncNanoId(),
    href: "/collection",
    name: "Sản phẩm",
    children: LIST_CATEGORY_PRODUCT,
  },
  {
    id: ncNanoId(),
    href: "/my-request",
    name: "Sửa xe"
  },
  {
    id: ncNanoId(),
    href: "/creator",
    name: "Khuyến mại",
  },
  {
    id: ncNanoId(),
    href: "/revenue",
    name: "Yêu thích"
  }
];
