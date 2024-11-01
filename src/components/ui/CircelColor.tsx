import { HTMLAttributes } from "react";
interface IProps extends HTMLAttributes<HTMLSpanElement> {
  color: string;
}

const CircelColor = ({ color, ...rest }: IProps) => {
  return (
    <span
      className="block w-5 h-5 rounded-full cursor-pointer mb-1"
      style={{ backgroundColor: color }}
      {...rest}
    ></span>
  );
};

export default CircelColor;
