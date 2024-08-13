import React from "react";

interface Props {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  w?: string;
  h?: string;
  disabled?: boolean;
  children: React.ReactNode;
}
export const Button = (props: Props) => {
  const { onClick, type = "button", w = "w-48", h = "h-10", disabled = false, children } = props;
  return (
    <button
      className={`bg-primary text-white font-inter font-bold ${w} ${h}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  )
}