import { Feature } from "@/types/feature";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { bgImage, title, paragraph } = feature;
  return (
    <div className="w-full">
      <div className="wow fadeInUp items-center justify-center flex" data-wow-delay=".15s">
        <div className="cursor-pointer mb-2 flex h-[100px] w-[100px] items-center justify-center rounded-md text-primary">
          {bgImage}
        </div>
      </div>
    </div>
  );
};

export default SingleFeature;
