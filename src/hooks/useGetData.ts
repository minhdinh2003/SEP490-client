"use client";

import http from "@/http/http";
import { useEffect, useState } from "react";

export const useGetData = (url: string, depen?: any[],setResponse? :any) => {
  const [data, setData] = useState([]);
  const listDepent = depen || [];
  const getData= async () => {
    try {
      const res = await http.get(url);
      if (res.payload.success) {
        setData(res.payload.data);
        if(setResponse){
          setResponse(res.payload.data)
        }
      }
    } catch (error) {}
  };
  useEffect(() => {
      getData()
  }, listDepent);

  return {
    data,
  };
};


export const usePostData = (url: string, body: any, depen?: any[], setResponse?: any) => {
  const [data, setData] = useState([]);
  const listDepent = depen || [];

  const postData = async () => {
    try {
      const res = await http.post(url, body);
      if (res.payload.success) {
        setData(res.payload.data);
        if (setResponse) {
          setResponse(res.payload.data);
        }
      }
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  useEffect(() => {
    postData();
  }, listDepent);

  return {
    data,
  };
};