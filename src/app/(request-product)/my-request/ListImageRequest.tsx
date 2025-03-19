"use client"

import CoverflowSlider from "@/components/slider/SliderImage";
import http from "@/http/http";
import { getUrlImage } from "@/utils/helpers";
import { useEffect, useState } from "react";

export const ListImageRequest = ({ id }: any) => {
    const [images, setImages] = useState();
    const getListImage = async () => {
      try {
        const res = await http.get(`ProductRequest/${id}`);
        console.log(res.payload.Data?.ImagesClient)
        setImages(res.payload.Data?.ImagesClient);
      } catch (error) {}
    };
    useEffect(() => {
      getListImage();
    }, [id]);
    return (
      <>
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-5">
            Danh sách hình ảnh minh họa
          </h3>
          <CoverflowSlider images={getUrlImage(images as any)?.listImage || []} />
        </div>
      </>
    );
  };