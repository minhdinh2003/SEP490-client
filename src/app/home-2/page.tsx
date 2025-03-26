"use client"
import Introduce from "@/components/Introduce";
import BrandList from "@/components/BrandList";
import Features from "@/components/Features";
import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Brands from "@/components/Brands";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import { useEffect, useState } from "react";
import BrandService from "@/http/brandService";
import { ServiceResponse } from "@/type/service.response";
import { Brand } from "@/models/base.model";
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
      {/* <Testimonials /> */}
      <Blog />
      <div className="container relative my-24 space-y-24 lg:space-y-32 lg:my-32">
        {/* <SectionHowItWork />s */}

        {/* <div className="relative py-24 lg:py-32">
          <BackgroundSection />
          <SectionGridMoreExplore data={DEMO_MORE_EXPLORE_DATA} />
        </div> */}

        {/* SECTION */}
        {/* <SectionGridFeatureItems data={SPORT_PRODUCTS} /> */}

        {/* SECTION */}
        {/* <SectionPromo1 /> */}
      </div>
    </div>
  );
}

export default PageHome2;
