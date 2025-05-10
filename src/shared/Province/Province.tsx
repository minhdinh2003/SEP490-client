"use client";
import Select from "@/shared/Select/Select";
import { useEffect, useState } from "react";

interface State {
  province: string;
  district: string;
  ward: string;
}

interface ProvinceProps {
  state: State;
  setStateData: (data: State) => void;
  width?: number;
  bold?: boolean;
  className?: string;
}

interface ProvinceData {
  name: string;
  huyen?: DistrictData[];
}

interface DistrictData {
  name: string;
  xa?: WardData[];
}

interface WardData {
  name: string;
}

const Province: React.FC<any> = ({
  state = { province: "", district: "", ward: "" },
  setStateData = (data: State) => {},
  width = "100%",
  bold = false,
  className,
  errors = {},
}) => {
  const [listProvince, setListProvince] = useState<ProvinceData[]>([]);
  const [listDistrict, setListDistrict] = useState<DistrictData[]>([]);
  const [listWard, setListWard] = useState<WardData[]>([]);

  const getListProvince = async () => {
    fetch(
      "https://raw.githubusercontent.com/phuockaito/KaitoShop.cf/master/src/data.json"
    )
      .then((res) => res.json())
      .then((city) => {
        setListProvince(city);
      });
  };

  useEffect(() => {
    getListProvince();
  }, []);

  const renderListOption = (list: { name: string }[]) => {
    return list.map((item, index) => (
      <option key={index} value={item.name}>
        {item.name}
      </option>
    ));
  };

  useEffect(() => {
    if (state.province && listProvince.length > 0) {
      const listDistrictByProvince =
        listProvince.find((i) => i.name === state.province)?.huyen || [];
      setListDistrict(listDistrictByProvince);
    }
  }, [state.province, listProvince]);

  useEffect(() => {
    if (state.province && state.district && listDistrict.length > 0) {
      const listWard1 =
        listDistrict.find((i) => i.name === state.district)?.xa || [];
      setListWard(listWard1);
    }
  }, [state.province, listDistrict, state.district]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <div style={{ width: "100%" }} className={className}>
        <span
          className={`nc-Label text-base font-medium text-neutral-900 dark:text-neutral-200`}
          style={{
            display: "inline-block",
            marginBottom: 5,
          }}
        >
          Tỉnh/Thành phố
        </span>
        <Select
          className="ant-input css-dev-only-do-not-override-1uweeqc ant-input-outlined ant-input-status-success Select"
          value={state.province}
          onChange={(v: any) =>
            setStateData({
              ...state,
              province: v.target.value,
              district: "",
              ward: "",
            })
          }
          style={{ width }}
        >
          <option value={""}>{""}</option>
          {renderListOption(listProvince)}
        </Select>
        <p className="text-red-500 text-sm">{errors.province}</p>
      </div>
      <div className={className} style={{ width: "100%" }}>
        <span
          className={`nc-Label text-base font-medium text-neutral-900 dark:text-neutral-200`}
          style={{
            display: "inline-block",
            marginBottom: 5,
          }}
        >
          Quận/Huyện
        </span>
        <Select
          className="ant-input css-dev-only-do-not-override-1uweeqc ant-input-outlined ant-input-status-success Select "
          disabled={!state.province}
          value={state.district}
          onChange={(v: any) =>
            setStateData({ ...state, district: v.target.value, ward: "" })
          }
          style={{ width }}
        >
          <option value={""}>{""}</option>
          {renderListOption(listDistrict)}
        </Select>

        {errors.district && (
          <p className="text-red-500 text-sm">{errors.district}</p>
        )}
      </div>
      <div className={className} style={{ width: "100%" }}>
        <span
          className={`nc-Label text-base font-medium text-neutral-900 dark:text-neutral-200`}
          style={{
            display: "inline-block",
            marginBottom: 5,
          }}
        >
          Phường/Xã
        </span>
        <Select
          className="Select"
          disabled={!state.district}
          value={state.ward}
          onChange={(v: any) =>
            setStateData({ ...state, ward: v.target.value })
          }
          style={{ width }}
        >
          <option value={""}>{""}</option>
          {renderListOption(listWard)}
        </Select>
        {errors.ward && <p className="text-red-500 text-sm">{errors.ward}</p>}
      </div>
    </div>
  );
};

export default Province;
