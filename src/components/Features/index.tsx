import { Brand } from "@/type/brand";
import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";
import React, { FC } from "react";
export interface DataProps {
  brands: Brand[];
}
const Features  :FC<DataProps> = ({brands}) => {
  return (
    <>
      <section id="features" className="py-8 md:py-10 lg:py-14">
        <div className="container">
          <SectionTitle
            title="Bảng giá xe"
            paragraph=""
            center
            mb="50px"
          />

          <div className="grid grid-cols-1 gap-x-4 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
            {brands.map((feature) => (
              <SingleFeature key={feature.id} data={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
