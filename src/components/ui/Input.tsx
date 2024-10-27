import { InputHTMLAttributes } from "react";
interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  test?: undefined;
}

const Input = ({ ...rest }: IProps) => {
  // console.log(rest);

  return (
    <input
      className="border-[1px] border-gray-300 rounded-md px-2 py-3 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 focus:ring-2 "
      {...rest}
    />
  );
};

export default Input;
