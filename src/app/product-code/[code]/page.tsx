"use client";
import http from "@/http/http";
import ButtonCircle from "@/shared/Button/ButtonCircle";
import Input from "@/shared/Input/Input";
import { handleErrorHttp } from "@/utils/handleError";
import {
  dateFormat,
  dateFormat2,
  dateFormat4,
  formatAddress,
  formatPriceVND,
  getUrlImage,
} from "@/utils/helpers";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PrinterOutlined } from '@ant-design/icons';
import { Button } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { fontVN } from "./Font-VN";
const ProductCode = () => {
  const { code: text } = useParams();
  const contentRef = useRef(null);
  const arrayBufferToBase64 = (buffer:any) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };
  
  
  const generatePDF = async() => {
    const doc:any = new jsPDF();
    doc.addFileToVFS("Roboto-Regular.ttf", fontVN);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto"); // Đặt font cho tài liệu PDF

    // Tiêu đề
    const pageWidth = doc.internal.pageSize.getWidth();

    const title = "Mã định danh ";
    const identifier = text;
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2 - 20, 20);

    // Thiết lập màu xanh lá cho "abc"
    doc.setTextColor(0, 128, 0); // Màu xanh lá
    doc.text(identifier, (pageWidth + titleWidth) / 2 - 20, 20);

    // Reset lại màu và font
    doc.setTextColor(0, 0, 0); // Đen
    doc.setFont("Roboto", "normal");
    
    // Dữ liệu sản phẩm
    const productData = [
      ["Tên sản phẩm", detail?.Title || detail?.Name],
      ["Mô tả", detail?.Description],
      ["Danh mục sản phẩm",  detail?.ProductCategories[0]?.Category?.Name],
      ["Chất liệu gỗ", detail?.ProductMaterials[0]?.Material?.Name],
      ["Ngày xuất bản", dateFormat(detail?.ProductDetail?.PublishDate)],
      ["Tags", detail?.ProductTags?.map((i: any) => i?.Tag?.Name)?.join(
        ", "
      )],
    ];

    // Dữ liệu bản quyền sản phẩm
    const ownershipData = [
      ["Họ tên",  detail?.User?.FirstName + " " + detail?.User?.LastName],
      ["Email", detail?.User?.Email],
      ["Giới tính", detail?.User?.Gender ? "Nam" : "Nữ"],
      ["Ngày sinh",  dateFormat(detail?.User?.Birthday)],
      ["Số điện thoại", detail?.User?.Phone],
      ["Địa chỉ",    formatAddress(detail?.User?.Address)],
    ];

    // Tạo bảng "Thông tin sản phẩm"
    doc.setFont("Roboto"); // Đặt font cho tài liệu PDF

    doc.autoTable({
      startY: 30,
      head: [["Thông tin sản phẩm", ""]],
      body: productData,  styles: { font: "Roboto" }, // Chỉ định font cho toàn bộ bảng
      headStyles: { font: "Roboto" }, // Chỉ định font cho phần đầu bảng
      bodyStyles: { font: "Roboto" }  // Chỉ định font cho phần thân bảng

    
    });


    // Tạo bảng "Bản quyền sản phẩm thuộc về"
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [["Thông tin bản quyền", ""]],
      body: ownershipData, 
       styles: { font: "Roboto" }, // Chỉ định font cho toàn bộ bảng
      headStyles: { font: "Roboto" }, // Chỉ định font cho phần đầu bảng
      bodyStyles: { font: "Roboto" }  // Chỉ định font cho phần thân bảng
    });

    // Lưu file PDF
    doc.save("product-details.pdf");
  };


  function renderTableRow(label: any, value: any) {
    return (
      <tr style={{ backgroundColor: "white" }}>
        <th
          className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r w-1/4"
          style={{ fontWeight: "bold !important" }}
        >
          {label}
        </th>
        <td
          style={{ backgroundColor: "white" }}
          className="px-6 py-3 text-sm text-gray-900"
        >
          {value}
        </td>
      </tr>
    );
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const [detail, setDetail] = useState<any>();

  const images = getUrlImage(detail?.Images).listImage || [];
  const getData = async (init = false, txt = "") => {
    const body = {
      PageSize: 10000,
      PageNumber: 1,
      Filter: `IsApproved=true and ProductCode.Contains(\"${
        txt || text || ""
      }\") and ProductType = 0  `,
      SortOrder: " CreatedDate desc",
      SearchKey: "",
    };

    try {
      const res = await http.post<any>(`Product/search`, body);
      let dt = res.payload.Data?.Data || [];
      let data = res.payload.Data?.Data || [];
      const detailData = data?.find(
        (i: any) => i?.ProductCode == (text as string)?.trim()
      );
      if (detailData) {
        setDetail(detailData);
      } else {
        setDetail("");
      }
    } catch (error: any) {
      //   handleErrorHttp(error?.payload);
    }
  };

  useEffect(() => {
    getData();
  }, [text]);
  return (
    <div className="p-20">
      <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold mb-10">
        Thông tin về sản phẩm , bản quyền của mã định danh {" "}
        <strong className="text-green-500">{text}</strong>{" "}
      </h1>
      <Button
      type="primary"
      icon={<PrinterOutlined />}
      size="large"
      style={{ display: 'flex', alignItems: 'center' }}
      className="bg-blue-500 mb-12"
      onClick={generatePDF}
    >
      In Thông Tin
    </Button>
      </div>
      {detail ? (
        <div className="flex gap-10 mt-10">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <div className="relative">
              <img
                src={images.length ? images[currentImageIndex] : ""}
                alt={`Product Image ${currentImageIndex}`}
                className="w-full h-[600px] object-cover shadow rounded-lg"
              />
            </div>
            <div className="flex mt-4 overflow-x-auto space-x-2">
              {images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Thumbnail ${index}`}
                  className={`w-16 h-16 object-cover cursor-pointer rounded ${
                    currentImageIndex === index
                      ? "border-2 border-blue-500"
                      : "opacity-70"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
          <div  ref={contentRef} className="md:w-1/2">
            <div className="p-4 border rounded shadow overflow-y-auto">
              <h2 className="text-xl font-bold mb-5">Thông tin sản phẩm</h2>
              <table className="min-w-full divide-y divide-gray-200">
                <tbody>
                  {renderTableRow(
                    "Tên sản phẩm",
                    detail?.Title || detail?.Name
                  )}
                  {renderTableRow("Mô tả", detail?.Description)}
                  {renderTableRow(
                    "Danh mục sản phẩm",
                    detail?.ProductCategories[0]?.Category?.Name
                  )}
                  {renderTableRow(
                    "Chất liệu gỗ",
                    detail?.ProductMaterials[0]?.Material?.Name
                  )}
                  {renderTableRow(
                    "Ngày xuất bản",
                    dateFormat(detail?.ProductDetail?.PublishDate)
                  )}
                  {renderTableRow(
                    "Tags",
                    detail?.ProductTags?.map((i: any) => i?.Tag?.Name)?.join(
                      ", "
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border rounded shadow overflow-y-auto mt-10">
              <h2 className="text-xl font-bold mb-5">
                Bản quyền sản phẩm thuộc về
              </h2>
              <table className="min-w-full divide-y divide-gray-200">
                <tbody>
                  {renderTableRow(
                    "Họ tên",
                    detail?.User?.FirstName + " " + detail?.User?.LastName
                  )}
                  {renderTableRow("Email", detail?.User?.Email)}
                  {renderTableRow(
                    "Giới tính",
                    detail?.User?.Gender ? "Nữ" : "Nam"
                  )}

                  {renderTableRow(
                    "Ngày sinh",
                    dateFormat(detail?.User?.Birthday)
                  )}
                  {renderTableRow("Số điện thoại", detail?.User?.Phone)}

                  {renderTableRow(
                    "Địa chỉ",
                    formatAddress(detail?.User?.Address)
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-600 text-center">Không tìm thấy sản phẩm</div>
      )}
    </div>
  );
};

export default ProductCode;
