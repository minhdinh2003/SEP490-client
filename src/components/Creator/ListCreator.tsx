import { FC } from "react";
import CreatorItemCard from "./CreatorItemCard";

interface PropsType {
  listCreator: any[];
}
export default function ListCreator({ listCreator }: PropsType) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
      {listCreator.map((item: any) => (
        <CreatorItemCard creator={item} key={item.id} />
      ))}
    </div>
  );
}
