
import { storage } from "@/provider/firebaseStorege";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
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

// Upload image to firebase

export async function uploadImagesToFirebase(files: any) {
  try {
    const uploadPromises = Array.from(files)?.map((file: any) => {
      const imageRef = ref(storage, `images/${file.name + uuidv4()}`);
      return uploadBytes(imageRef, file).then(() => getDownloadURL(imageRef));
    });

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error uploading images to Firebase:", error);
    return null;
  }
}


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
  const { Type, RawData, SenderName } = notification;
  const data = JSON.parse(RawData);

  let message = "";
  let path = "";

  switch (Type) {
    case "User_Reply_Request":
      message = `${SenderName} đã trả lời yêu cầu: ${data.Title}`;
      path = `/request/${data.RequestID}`;
      break;
    case "Creator_Reply_Request":
      message = `${SenderName} đã trả lời yêu cầu: ${data.Title}`;
      path = `/request/${data.RequestID}`;
      break;
    case "User_Create_Request":
      message = `${SenderName} đã tạo yêu cầu sản phẩm`;
      path = `/request-list?id=${data.ProductRequestID}`;
      break;
    case "User_Cancel_Request":
      message = `${SenderName} đã hủy yêu cầu sản phẩm`;
      path = `/request-list?id=${data.ProductRequestID}`;
      break;
    case "Creator_Accept_Request":
      message = `${SenderName} đã chấp nhận yêu cầu sản phẩm`;
      path = `/my-request?id=${data.ProductRequestID}`;
      break;
    case "Creator_Reject_Request":
      message = `${SenderName} đã từ chối yêu cầu sản phẩm`;
      path = `/my-request?id=${data.ProductRequestID}}`;
      break;
    case "Creator_Complete_Request":
      message = `${SenderName} đã hoàn thành yêu cầu. Thanh toán ngay`;
      path = `/my-request?id=${data.ProductRequestID}`;
      break;
    case "Remind_Auction":
      message = `Nhắc nhở về cuộc đấu giá: ${data.Title}`;
      path = `/auction-detail/${data.AuctionItemID}`;
      break;
    case "End_Auction":
      message = `Cuộc đấu giá đã kết thúc: ${data.Title}`;
      path = `/auction-list`;
      break;
    case "Win_Auction":
      message = `Bạn đã thắng cuộc đấu giá: ${data.Title}`;
      path = `/auction-result`;
      break;
    case "Done_Auction":
      message = `Cuộc đấu giá đã hoàn tất: ${data.Title}`;
      path = `/auction-list`;
      break;
    case "User_Create_Auction":
      message = `${SenderName} đã tạo cuộc đấu giá: ${data.Title}`;
      path = "/app/auction";
      break;
    case "User_Update_Auction":
      message = `${SenderName} đã cập nhật cuộc đấu giá: ${data.Title}`;
      path = `/auction/${data.AuctionItemID}`;
      break;
    case "Staff_Admin_Confirm_Auction":
      message = ` Cuộc đấu giá: ${data.Title} đã được xác nhận`;
      path = `/my-auction`;
      break;
    case "User_Place_Bid_Auction":
      message = `${SenderName} đã đặt  trong cuộc đấu giá: ${data.Title}`;
      path = `/auction/${data.AuctionItemID}`;
      break;
    case "System_Remove_Noti_Auction":
      message = `Hệ thống đã xóa thông báo về cuộc đấu giá: ${data.Title}`;
      path = `/auction/${data.AuctionItemID}`;
      break;
    case "Staff_Admin_Confirm_Reject":
      message = `Cuộc đấu giá bị từ chối: ${data.Title}`;
      path = `/my-auction`;
      break;
    case "Staff_Admin_Approve_Product":
      message = `Sản phẩm đã được duyệt`;
      path = `/my-product`;
      break;
    case "Staff_Admin_Reject_Product":
      message = `Sản phẩm đã  bị từ chối`;
      path = `/my-product`;
      break;
    case "Customer_Review_Work":
      message = `Sản phẩm yêu cầu của bạn đã có bản xem trước`;
      path = `/my-request?id=${data.ProductRequestID}`;
      break;
    case "Customer_Reject_Work":
      message = `Khách hàng đã từ chối bản xem trước của bạn`;
      path = `/request-list?id=${data.ProductRequestID}`;
      break;
    case "Customer_SendMessage_Request":
      message = `Khách hàng đã phản hổi về sản phẩm`;
      path = `/request-list?id=${data.ProductRequestID}`;
      break;
    case "Creator_SendMessage_Request":
      message = `Người sáng tạo đã phản hổi về sản phẩm`;
      path = `/my-request?id=${data.ProductRequestID}`;
      break;
    case "Win_Auction":
      message = `Bạn đã thắng cuộc đấu giá`;
      path = `/auction-list`;
      break;
    case "Fail_Auction":
      message = `Bạn đã thua cuộc đấu giá`;
      path = `/auction-list`;
      break;
    case "Remind_Pay_Auction":
      message = `Bạn cần thanh toán sản phẩm đấu giá trong vòng 24h kế từ thời điểm kết thúc`;
      path = `/auction-result`;
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
  [RequestProductStatus.Pending]: { text: "Chờ xử lý", color: "" },
  [RequestProductStatus.Approved]: { text: "Đã duyệt", color: "blue" },
  [RequestProductStatus.Done]: { text: "Hoàn thành", color: "blue" },
  [RequestProductStatus.Reject]: { text: "Từ chối", color: "red" },
  [RequestProductStatus.Cancel]: { text: "Hủy bỏ", color: "gray" },
};

export const getRequestProductStatusText = (status: any) => {
  status = Number(status);
  return RequestProductStatusDetails[status]?.text || "Unknown status";
};

export const getRequestProductStatusColor = (status: any) => {
  return RequestProductStatusDetails[status]?.color;
};

export const WorkStatus = {
  InProgress: 1, // đang tiến hành
  Review: 2, // đánh giá
  Done: 3, // đã hoàn thành
  Reject: 4, // từ chối
};

export const WorkStatusDetail = {
  [WorkStatus.InProgress]: { text: "Đang tiến hành", color: "" },
  [WorkStatus.Review]: { text: "Đã có sản phẩm", color: "blue" },
  [WorkStatus.Done]: { text: "Đã hoàn thành", color: "blue" },
  [WorkStatus.Reject]: { text: "Từ chối", color: "red" },
};

export const getWorkStatusText = (status: any) => {
  status = Number(status);
  return WorkStatusDetail[status]?.text || "Unknown status";
};

export const getWorkStatusColor = (status: any) => {
  return WorkStatusDetail[status]?.color;
};


export const shortTxt = (length: number, txt: string) => {
  txt = String(txt)
  return txt?.length > length ? txt?.substring(0, length) + "..." : txt
}