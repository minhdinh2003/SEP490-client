import NcImage from "@/shared/NcImage/NcImage";
import Link from "next/link";
import { FC } from "react";
import LikeButton from "../LikeButton";

interface PropsType {
  creator: any;
  className?:string,
  isLiked?:Boolean
}
export default function CreatorItemCard({ creator,className ,isLiked}: PropsType) {
  return <div
  className={`nc-ProductCard relative flex flex-col bg-transparent ${className}`}
>
  <Link href={"#"} className="absolute inset-0"></Link>

  <div className="relative flex-shrink-0 bg-slate-50 dark:bg-slate-300 rounded-3xl overflow-hidden z-1 group">
    <Link href={"/product-detail/1"} className="block">
      <NcImage
        containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0"
        src={creator.image}
        className="object-cover w-full h-full drop-shadow-xl"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 40vw"
        alt="product"
      />
    </Link>
    <LikeButton liked={!isLiked ? false :true} className="absolute top-3 end-3 z-10" />
  </div>

  <div className="space-y-4 px-2.5 pt-5 pb-2.5">
    {/* {renderVariants()} */}
    <div>
      <h2 className="nc-ProductCard__title text-base font-semibold transition-colors">
        {creator.name}
      </h2>
      <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 `}>
        {creator.description}
      </p>
    </div>

 
  </div>
</div>

}
