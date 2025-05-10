import React, { useEffect, useState } from "react";
import "./CoverflowSlider.css";
import { Image } from "antd";

const CoverflowSlider = ({ images: listImage }: any) => {
  const [angle, setAngle] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const gallerySpin = (sign: any) => {
    if (!sign) {
      setAngle((prevAngle) => prevAngle + 45);
    } else {
      setAngle((prevAngle) => prevAngle - 45);
    }
  };

  useEffect(() => {
    // gallerySpin('')
  }, []);
  return (
    <div className="aspect-w-16 relative">
      <div className="relative">
        <Image
          height={500}
          width={"50%"}
          src={listImage.length ? listImage[currentImageIndex] : ""}
          alt={`Product Image ${currentImageIndex}`}
          className="w-full h-[600px] object-cover shadow rounded-lg"
        />
        <div className="flex mt-4 overflow-x-auto space-x-2">
          {listImage.map((url: any, index: any): any => (
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
    </div>
  );
};

export default CoverflowSlider;
