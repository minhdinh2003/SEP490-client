import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Blog from "@/components/Blog";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Introduce from "@/components/Introduce";
import Testimonials from "@/components/Testimonials";
import { Metadata } from "next";
import Carousel from "@/components/Carousel";
export const metadata: Metadata = {
  title: "Mua bán, sửa chữa xe",
  description: "Website chuyển cung cấp dịch vụ mua bán, sửa chữa xe",
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Introduce />
      <Carousel />
      <Features />
      <AboutSectionOne />
      <AboutSectionTwo />
      <Brands />
      <Testimonials />
      {/* <Pricing /> */}
      <Blog />
      {/* <Contact /> */}
    </>
  );
}
