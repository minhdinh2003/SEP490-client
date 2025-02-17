import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = () => {
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
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
