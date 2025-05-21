"use client";
import { useState, useEffect } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Select from "react-select";
import UserService from "@/http/userService";
import ProductService from "@/http/productService";
import OrderService from "@/http/orderService";
import NcModal from "@/shared/NcModal/NcModal";
import AddCustomer from "./AddCustomer";
import { ServiceResponse } from "@/type/service.response";
import { IPagingParam } from "@/contains/paging";
import { formatPriceVND, getUrlImage } from "@/utils/helpers";
import Image from "next/image";
import toast from "react-hot-toast";

const CreateOrder = () => {
  const [formData, setFormData] = useState({
    userId: "",
    productId: "",
    agreedPrice: "",
    paymentMethod: "0",
    note: "",
    shippingAddress: "", // Thêm trường địa chỉ nhận hàng
  });

  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false);
  const [agreedPriceInput, setAgreedPriceInput] = useState("");
  const [errors, setErrors] = useState<any>({});

  // Fetch danh sách khách hàng
  const fetchCustomers = async () => {
    try {
      const param: IPagingParam = {
        pageSize: 1000,
        pageNumber: 1,
        conditions: [{ key: "role", condition: "equal", value: "USER" }],
        searchKey: "",
        searchFields: [],
        includeReferences: {},
        sortOrder: "createdAt desc",
      };
      const res = await UserService.getPaging<ServiceResponse>(param);
      setCustomers(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Fetch danh sách sản phẩm còn hàng
  const fetchProducts = async () => {
    try {
      const param: IPagingParam = {
        pageSize: 1000,
        pageNumber: 1,
        conditions: [
          {
            key: "any",
            condition: "raw",
            value: { inventory: { quantity: { gt: 0 } } },
          },
        ],
        searchKey: "",
        searchFields: [],
        includeReferences: {},
        sortOrder: "createdAt desc",
      };
      const res = await ProductService.getPaging<ServiceResponse>(param);
      setProducts(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  // Format tiền VND
  const formatToVND = (value: string) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Unformat tiền VND
  const unformatVND = (value: string) => {
    return value.replace(/\./g, "");
  };

  // Xử lý thay đổi dữ liệu form
  const handleChange = (key: string) => (e: any) => {
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
  };

  // Xử lý thay đổi giá thỏa thuận
  const handleChangePrice = (e: any) => {
    const rawValue = e.target.value;
    const formattedValue = formatToVND(rawValue);
    setAgreedPriceInput(formattedValue);
    setFormData({ ...formData, agreedPrice: unformatVND(formattedValue) });
  };

  // Validation form
  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.userId) {
      newErrors.userId = "Vui lòng chọn khách hàng";
    }
    if (!formData.productId) {
      newErrors.productId = "Vui lòng chọn sản phẩm";
    }
    if (
      !formData.agreedPrice ||
      isNaN(Number(formData.agreedPrice)) ||
      Number(formData.agreedPrice) <= 0
    ) {
      newErrors.agreedPrice = "Giá thỏa thuận không hợp lệ";
    }
    if (formData.paymentMethod !== "1" && !formData.shippingAddress) {
      newErrors.shippingAddress = "Vui lòng nhập địa chỉ nhận hàng";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Tạo đơn hàng
  const handleCreateOrder = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      const body = {
        orderItems: [
          {
            productId: Number(formData.productId),
            quantity: 1,
            paymentMethod: Number(formData.paymentMethod),
          },
        ],
        fullName: selectedCustomer?.fullName,
        address: formData.shippingAddress,
        phoneNumber: selectedCustomer?.phoneNumber,
        userId: Number(formData.userId),
        agreedPrice: parseInt(formData.agreedPrice),
        voucherCode: "", // Thêm mã voucher nếu cần
      };

      const res = await OrderService.post<ServiceResponse>(
        "/ownerCreateOrder",
        body
      );

      if (!res.success) {
        toast.error(res.devMessage);
        return;
      }

      toast.success("Tạo đơn hàng thành công");
      resetForm();
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi tạo đơn hàng");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      userId: "",
      productId: "",
      agreedPrice: "",
      paymentMethod: "0",
      note: "",
      shippingAddress: "",
    });
    setSelectedCustomer(null);
    setSelectedProduct(null);
    setAgreedPriceInput("");
    setErrors({});
  };

  // Custom Option cho Select sản phẩm
  const CustomOption = ({ innerProps, data }: any) => {
    return (
      <div
        {...innerProps}
        className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
      >
        {/* Hình ảnh sản phẩm */}
        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={data.image}
            alt={data.label}
            width={80}
            height={96}
            className="w-full h-full object-cover object-center"
          />
        </div>
        {/* Thông tin sản phẩm */}
        <div className="ms-4 flex flex-1 flex-col">
          <h3 className="text-base font-medium">{data.label}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {data.price}
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            {data.description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="nc-CartPage">
      <main className="py-5">
        <form className="grid grid-cols-1 gap-4">
          {/* Chọn khách hàng */}
          <label className="block">
            <span className="text-neutral-800 dark:text-neutral-200">
              Chọn khách hàng
            </span>
            <div className="flex mt-2">
              <Select
                options={customers.map((customer) => ({
                  value: customer.id,
                  label: `${customer.fullName} - ${customer.phoneNumber}`,
                  fullName: customer.fullName,
                  phoneNumber: customer.phoneNumber,
                }))}
                value={selectedCustomer}
                onChange={(selectedOption: any) => {
                  setSelectedCustomer(selectedOption);
                  setFormData({ ...formData, userId: selectedOption?.value });
                }}
                placeholder="-- Chọn khách hàng --"
                isSearchable
                className="w-full"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setOpenAddCustomerModal(true);
                }}
                className="ml-2 bg-white text-black px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition duration-300"
              >
                Thêm
              </button>
            </div>
            {errors.userId && (
              <span className="text-red-500 text-sm">{errors.userId}</span>
            )}
          </label>

          {/* Chọn sản phẩm */}
          <label className="block">
            <span className="text-neutral-800 dark:text-neutral-200">
              Chọn sản phẩm
            </span>
            <Select
              options={products.map((product) => ({
                value: product.id,
                label: product.name,
                image: getUrlImage(product.listImage)?.mainImage,
                price: formatPriceVND(product.price),
                description: product.description,
              }))}
              value={selectedProduct}
              onChange={(selectedOption: any) => {
                setSelectedProduct(selectedOption);
                setFormData({ ...formData, productId: selectedOption?.value });
              }}
              placeholder="-- Chọn sản phẩm --"
              isSearchable
              className="w-full"
              components={{ Option: CustomOption }}
            />
            {errors.productId && (
              <span className="text-red-500 text-sm">{errors.productId}</span>
            )}
          </label>

          {/* Hiển thị thông tin sản phẩm */}
          {selectedProduct && (
            <div className="block">
              <span className="text-neutral-800 dark:text-neutral-200 font-semibold">
                Thông tin sản phẩm:
              </span>
              <div className="mt-2 flex items-center gap-4">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.label}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    - Tên: {selectedProduct.label}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    - Giá niêm yết: {selectedProduct.price}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Nhập giá thỏa thuận */}
          <label className="block">
            <span className="text-neutral-800 dark:text-neutral-200">
              Giá thỏa thuận
            </span>
            <input
              type="text"
              value={agreedPriceInput}
              onChange={handleChangePrice}
              placeholder="Nhập giá thỏa thuận"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.agreedPrice && (
              <span className="text-red-500 text-sm">{errors.agreedPrice}</span>
            )}
          </label>

          {/* Chọn phương thức thanh toán */}
          <label className="block">
            <span className="text-neutral-800 dark:text-neutral-200">
              Phương thức thanh toán
            </span>
            <select
              value={formData.paymentMethod}
              onChange={handleChange("paymentMethod")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="0">Thanh toán online</option>
              <option value="1">Thanh toán tại quầy</option>
              <option value="2">Thanh toán khi nhận hàng</option>
            </select>
          </label>

          {/* Địa chỉ nhận hàng (chỉ hiển thị khi phương thức là COD) */}
          {formData.paymentMethod !== "1" && (
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Địa chỉ nhận hàng
              </span>
              <Input
                value={formData.shippingAddress}
                onChange={handleChange("shippingAddress")}
                placeholder="Nhập địa chỉ nhận hàng"
                className="mt-1"
              />
              {errors.shippingAddress && (
                <span className="text-red-500 text-sm">
                  {errors.shippingAddress}
                </span>
              )}
            </label>
          )}

          {/* Ghi chú */}
          <label className="block">
            <span className="text-neutral-800 dark:text-neutral-200">
              Ghi chú
            </span>
            <Input
              value={formData.note}
              onChange={handleChange("note")}
              placeholder="Nhập ghi chú"
              className="mt-1 h-[100px]"
            />
          </label>

          {/* Nút tạo đơn hàng */}
        </form>
        <div className="flex justify-center items-center mt-4">
          <ButtonPrimary onClick={handleCreateOrder} className="mt-4">
            Tạo đơn hàng
          </ButtonPrimary>
        </div>
      </main>

      {/* Modal thêm khách hàng */}
      <NcModal
        isOpenProp={openAddCustomerModal}
        onCloseModal={() => {
          setOpenAddCustomerModal(false);
          fetchCustomers(); // Refresh danh sách khách hàng sau khi thêm
        }}
        renderContent={() => (
          <AddCustomer callback={() => setOpenAddCustomerModal(false)} />
        )}
        modalTitle="Thêm khách hàng"
      />
    </div>
  );
};

export default CreateOrder;
