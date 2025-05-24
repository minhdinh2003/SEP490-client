
import moment from "moment";
import { v4 as uuidv4 } from "uuid";


export const getUrlImage = (Images: string) => {
  let mainImage = "";
  let listImage: string[] = [];

  if (Array.isArray(Images) && Images.length > 0) {
    mainImage = Images[0];
    listImage = Images;
  } else {
    if (typeof Images === "string") {
      listImage = Images.split("*");
      if (listImage.length > 0) {
        mainImage = listImage[0];
      }
    }
  }
  return {
    mainImage,
    listImage,
  };
};



export const dateFormat = (date: any) =>
  date ? moment(date).format("DD-MM-YYYY") : "";
export const dateFormat2 = (date: any) =>
  date ? moment(date).format("YYYY-MM-DD") : "";
export const dateFormat3 = (date: any) =>
  date ? moment(date).format("DD-MM-YYYY hh:mm:ss") : "";
export const dateFormat4 = (date: any) =>
  date ? moment(date).format("YYYY-MM-DD hh:mm:ss") : "";
export const formatCoin = (coin: any) => {
  coin = Number(coin);
  if (coin < 1000) {
    return coin;
  } else return (coin / 1000).toFixed(1) + "k";
};

export function formatPriceVND(price: any) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export const renderMessage = (notification: any) => {
  const { type, rawData, senderName } = notification;
  const data = JSON.parse(rawData);

  let message = "";
  let path = "";

  switch (type) {
    case "USER_SEND_REQUEST_PRODUCT_OWNER":
      message = `${senderName} đã gửi yêu cầu sửa chữa tới bạn`;
      path = `/request-list`;
      break;
    case "SEND_VOUCHER_CUSTOMER":
      message = `Bạn đã nhận được voucher từ quản lý cửa hàng`;
      path = `/account-voucher`;
      break;
    case "EMPLOYEE_SEND_REQUEST_PRODUCT_OWNER":
      message = `Nhân viên ${senderName} đã gửi yêu cầu sửa chữa tới bạn`;
      path = `/request-list`;
      break;
    case "USER_CHAT_REQUEST":
      message = `${senderName} đã phản hồi yêu cầu sửa chữa tới bạn`;
      break;
    case "PRODUCT_OWNER_CHAT_REQUEST":
      message = `Quản lý cửa hàng đã phản hồi yêu cầu sửa chữa tới bạn`;
      break;
    case 'PRODUCT_OWNER_REJECT_REQUEST':
      message = 'Quản lý cửa hàng đã từ chối yêu cầu sửa chữa của bạn';
      break;
    case 'PRODUCT_OWNER_ACCEPT_REQUEST':
      message = 'Quản lý cửa hàng đã xác nhận giá dịch vụ sửa chữa. Bạn vui lòng vào xác nhận lại.';
      break;
    case 'AMIN_ASSIGN_TASK':
      message = "Quản lý của hàng vừa giao cho bạn nhiệm vụ sửa";
      break;
    case "DONE_REQUEST":
      message = "Đã hoàn thành xong hết các task sửa sản phẩm";
      break;
    case "DONE_REQUEST_USER":
      message = "Đã hoàn thành xong task. Vui lòng thanh toán để nhận hàng";
      break;
    case "PRODUCT_OWNER_DONE_REQUEST":
      message = "Quản lý cửa hàng đã hoàn thành yêu cầu sửa chữa của bạn";
      break;
    case "USER_CONFIRM_REQUEST":
      message = "Người dùng đã xác nhận yêu cầu sửa chữa của họ";
      break;
    case "OWNER_CREATE_ORDER_FOR_CUSTOMER":
      message = "Quản lý cửa hàng đã tạo đơn hàng cho bạn";
      break;
    case "USER_CHAT_WITH_OWNER":
    case "OWNER_CHAT_WITH_USER":
      message = `${senderName} đã nhắn tin cho bạn`;
      break;
    default:
      message = "Thông báo không xác định";
      path = "/";
      break;
  }

  return { message, path };
};

//
export const getAddress = (add: any) => {
  const list = add?.split("***");
  if (list?.length === 2) {
    const province = list[0];
    const address = list[1];
    return {
      province: JSON.parse(
        province ? (province == "undefined" ? "{}" : province) : "{}"
      ),
      address,
    };
  }
  return {
    address: list?.length === 1 ? list[0] : "",
  };
};
export const formatAddress = (add: any) => {
  const data = getAddress(add);
  if (!data) {
    return "";
  }
  const pro = data?.province;
  const address = data?.address;
  const province = pro?.province ? pro?.province + " , " : "";
  const district = pro?.district ? pro?.district + " , " : "";
  const ward = pro?.ward ? pro?.ward + " , " : "";
  return province + district + ward + address;
};
export const AuctionStatus = {
  Pending: 0, // chờ phê duyệt
  Approved: 1, // đã duyệt
  Cancel: 2, // hủy
  Done: 3, // hoàn thành
  Reject: 4, // từ chối
};

const StatusDetails = {
  [AuctionStatus.Pending]: { text: "Chờ phê duyệt", color: "" },
  [AuctionStatus.Approved]: { text: "Đã duyệt", color: "blue" },
  [AuctionStatus.Cancel]: { text: "Đã hủy", color: "red" },
  [AuctionStatus.Done]: { text: "Đã hoàn thành", color: "blue" },
  [AuctionStatus.Reject]: { text: "Đã từ chối", color: "gray" },
};
export const getStatusText = (status: any) => {
  status = Number(status);
  return StatusDetails[status]?.text || "Unknown status";
};

export const getStatusColor = (status: any) => {
  return StatusDetails[status]?.color;
};

// OrderStatus.js
export const OrderStatus = {
  Wait: 0, // chờ thành toán
  Success: 1, // đã thanh toán
  Error: 2, // Giao dịch lỗi
  Cancel: 3, // Hủy giao dịch
};

const OrderStatusDetails = {
  [OrderStatus.Wait]: { text: "Chờ thanh toán", color: "" },
  [OrderStatus.Success]: { text: "Đã thanh toán", color: "blue" },
  [OrderStatus.Error]: { text: "Giao dịch lỗi", color: "red" },
  [OrderStatus.Cancel]: { text: "Hủy giao dịch", color: "gray" },
};

export const getOrderStatusText = (status: any) => {
  status = Number(status);
  return OrderStatusDetails[status]?.text || "Unknown status";
};

export const getOrderStatusColor = (status: any) => {
  return OrderStatusDetails[status]?.color;
};

// ShippingStatus.js
export const ShippingStatus = {
  Pending: 4, // chờ xử lý
  Shipped: 5, // đã gửi hàng
  Delivered: 6, // đã nhận hàng
  Cancelled: 7, // đơn hàng bị hủy
};

export const ShippingStatusDetails = {
  [ShippingStatus.Pending]: { text: "Chờ xử lý", color: "" },
  [ShippingStatus.Shipped]: { text: "Đã gửi hàng", color: "blue" },
  [ShippingStatus.Delivered]: { text: "Đã nhận hàng", color: "blue" },
  [ShippingStatus.Cancelled]: { text: "Đơn hàng bị hủy", color: "red" },
};
export enum StatusOrder {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  PROCESSING = "PROCESSING",
}

export enum RequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED", // Đã phê duyệt
  REJECTED = "REJECTED", // Từ chối
  IN_PROGRESS = "IN_PROGRESS", // Đang tiến hành
  COMPLETED = "COMPLETED", // Hoàn thành
  CANCELLED = "CANCELLED"
}

export const StatusOrderDetails = {
  [StatusOrder.PENDING]: { text: "Chờ xử lý", color: "" },
  [StatusOrder.SHIPPED]: { text: "Đã gửi hàng", color: "blue" },
  [StatusOrder.DELIVERED]: { text: "Đã nhận hàng", color: "blue" },
  [StatusOrder.CANCELLED]: { text: "Đơn hàng bị hủy", color: "red" },
  [StatusOrder.PROCESSING]: { text: "Đang giao hàng", color: "orange" },
};

export const getShippingStatusText = (status: any) => {
  status = Number(status);
  return ShippingStatusDetails[status]?.text || "Unknown status";
};

export const getShippingStatusColor = (status: any) => {
  return ShippingStatusDetails[status]?.color;
};
// RequestProductStatus.js
export const RequestProductStatus = {
  Pending: 0, // chờ xử lý
  Approved: 1, // đã phê duyệt
  Done: 2, // đã hoàn thành
  Reject: 3, // từ chối
  Cancel: 4, // hủy bỏ
};

export const RequestProductStatusDetails = {
  [RequestStatus.PENDING]: { text: "Chờ xử lý", color: "" },
  [RequestStatus.APPROVED]: { text: "Đã duyệt", color: "blue" },
  [RequestStatus.COMPLETED]: { text: "Hoàn thành", color: "blue" },
  [RequestStatus.REJECTED]: { text: "Từ chối", color: "red" },
  [RequestStatus.IN_PROGRESS]: { text: "Đang tiến hành", color: "gray" },
  [RequestStatus.CANCELLED]: { text: "Hủy yêu cầu", color: "red" }
};

export const getRequestProductStatusText = (status: RequestStatus) => {
  return RequestProductStatusDetails[status]?.text || "Unknown status";
};

export const getRequestProductStatusColor = (status: RequestStatus) => {
  return RequestProductStatusDetails[status]?.color;
};

export const WorkStatus = {
  InProgress: "PENDING", // đang tiến hành
  Review: "IN_PROGRESS", // đánh giá
  Done: "COMPLETED", // đã hoàn thành
  Reject: "CANCELLED", // từ chối
};

export const WorkStatusDetail = {
  [WorkStatus.InProgress]: { text: "Đang tiến hành", color: "" },
  [WorkStatus.Review]: { text: "Đang tiến hành", color: "blue" },
  [WorkStatus.Done]: { text: "Đã hoàn thành", color: "blue" },
  [WorkStatus.Reject]: { text: "Đã hủy", color: "red" },
};

export const getWorkStatusText = (status: any) => {
  return WorkStatusDetail[status]?.text || "Unknown status";
};

export const getWorkStatusColor = (status: any) => {
  return WorkStatusDetail[status]?.color;
};


export const shortTxt = (length: number, txt: string) => {
  txt = String(txt)
  return txt?.length > length ? txt?.substring(0, length) + "..." : txt
}