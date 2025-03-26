import { ProductCategory, ProductStatus } from '@/enum/category-type';

export interface BaseEntity {
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  EMPLOYEE = 'EMPLOYEE',
  OWNER = 'OWNER'
}

// Enum Gender
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}
export interface User extends BaseEntity {
  id: number; // Khóa chính, tự động tăng
  fullName: string; // Họ và tên đầy đủ
  email: string; // Địa chỉ email duy nhất
  role: Role; // Vai trò người dùng (enum)
  gender: Gender; // Giới tính (enum), mặc định là OTHER
  dateOfBirth?: Date | null; // Ngày sinh (có thể null)
  phoneNumber?: string | null; // Số điện thoại (có thể null)
  addressLine1?: string | null; // Địa chỉ 1 (có thể null)
  addressLine2?: string | null; // Địa chỉ 2 (có thể null)
  city?: string | null; // Thành phố (có thể null)
  state?: string | null; // Bang hoặc tỉnh (có thể null)
  country?: string | null; // Quốc gia (có thể null)
  profilePictureURL?: string | null; // URL ảnh đại diện (có thể null)
}

export interface Brand extends BaseEntity {
  id: number; // Khóa chính, tự động tăng
  name?: string; // Tên thương hiệu
  description?: string; // Mô tả thương hiệu (có thể null)
  logoURL: string; // Đường dẫn hình ảnh logo (có thể null)
}

export interface Product extends BaseEntity {
  id: number; // Khóa chính tự động tăng
  name: string; // Tên sản phẩm
  description?: string; // Mô tả sản phẩm (có thể null)
  price: number; // Giá sản phẩm
  category: ProductCategory; // Loại sản phẩm: 'CAR' hoặc 'PART'
  model?: string | null; // Mẫu xe (nếu là xe)
  year?: number | null; // Năm sản xuất (nếu là xe)
  status: ProductStatus; // Trạng thái sản phẩm (AVAILABLE, SOLD, OUT_OF_STOCK)
  listImage?: any[] | null; // Danh sách hình ảnh (JSON)
  style?: string | null; // Kiểu dáng
  engine_capacity?: string | null; // Dung tích động cơ
  fuel_type?: string | null; // Loại nhiên liệu
  transmission?: string | null; // Hộp số
  mileage?: number | null; // Chỉ số đồng hồ (số km đã đi)
  exterior_color?: string | null; // Màu xe
  interior_color?: string | null; // Màu nội thất
  origin?: string | null; // Xuất xứ
  seats?: number | null; // Số chỗ ngồi
  doors?: number | null; // Số cửa
  inventory: Inventory;
}

export interface Inventory extends BaseEntity {
  id: number;
  productId: number;
  quantity: number;
}
