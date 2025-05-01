"use client"
import Introduce from "@/components/Introduce";
import BrandList from "@/components/BrandList";
import Features from "@/components/Features";
import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Brands from "@/components/Brands";
import Blog from "@/components/Blog";
import { useEffect, useState } from "react";
import BrandService from "@/http/brandService";
import { ServiceResponse } from "@/type/service.response";
function PageHome2() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BrandService.getAll<ServiceResponse>()
      .then((response) => {
        setBrands(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
        setLoading(false);
      });
  }, []);
  return (
    <div className="relative overflow-hidden nc-PageHome2">
      <Introduce />
      <BrandList brands={brands}/>
      <Features brands={brands} />
      <AboutSectionOne />
      <AboutSectionTwo />
      <Brands />
      <Blog />
      <div className="container relative my-24 space-y-24 lg:space-y-32 lg:my-32">

      </div>
    </div>
  );
}

export default PageHome2;
