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

export const NAVIGATION_DEMO_2: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Trang chủ",
    children: LIST_CATEGORY_PRODUCT,
    role: ["USER", "ADMIN", "OWNER", "GUEST"]
  },
  {
    id: ncNanoId(),
    href: "/collection",
    name: "Sản phẩm",
    children: LIST_CATEGORY_PRODUCT,
    role: ["USER", "ADMIN", "OWNER", "GUEST"]
  },
  {
    id: ncNanoId(),
    href: "/my-request",
    name: "Dịch vụ sửa chữa",
    role: ["USER"]
  },
  {
    id: ncNanoId(),
    href: "/request-list",
    name: "Yêu cầu sửa",
    role: ["OWNER"]
  },
  {
    id: ncNanoId(),
    href: "/task-list",
    name: "Danh sách task",
    role: ["EMPLOYEE"]
  },
  {
    id: ncNanoId(),
    href: "/promotion",
    name: "Khuyến mại",
    role: ["USER", "ADMIN", "OWNER", "GUEST"]
  },
  {
    id: ncNanoId(),
    href: "/cart",
    name: "Yêu thích",
    role: ["USER", "ADMIN", "OWNER"]
  },
  {
    id: ncNanoId(),
    href: "/order-me",
    name: "Quản lý đơn hàng",
    role: ["ADMIN", "OWNER"]
  }
];
