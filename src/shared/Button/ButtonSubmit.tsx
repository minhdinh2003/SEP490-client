"use client";
import Button, { ButtonProps } from "@/shared/Button/Button";
import React from "react";
import { useFormStatus } from "react-dom";

export interface ButtonSubmitProps extends ButtonProps {}

const ButtonSubmit: React.FC<ButtonSubmitProps> = ({
  className = "",
  ...args
}) => {
  const { pending } = useFormStatus();

  return (
    <Button
      loading={pending}
      className={`ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-slate-50 dark:text-slate-800 shadow-xl ${className}`}
      {...args}
    />
  );
};

export default ButtonSubmit;
