import { FC } from "react";
import { IProduct } from "../interfaces/index.ts";
import Image from "./Image.tsx";
import Button from "./ui/Button.tsx";
import { textCut } from "../utlis/function.ts";
import CircelColor from "./ui/CircelColor.tsx";
interface IProps {
  product: IProduct;
  setProductToEdit: (product: IProduct) => void;
  openEditModel: () => void;
  openRemoveModel: () => void;
  setProductToEditIdx: (idx: number) => void;
  idx: number;
}

const ProductCard: FC<IProps> = ({
  product,
  setProductToEdit,
  openEditModel,
  setProductToEditIdx,
  openRemoveModel,
  idx,
}) => {
  /*STATE */
  const { imageURL, title, description, price, category, colors } = product;
  // HANDLER
  const onEdit = (product: IProduct) => {
    setProductToEdit(product);
    openEditModel();
    setProductToEditIdx(idx);
  };
  const onRemove = (product: IProduct) => {
    setProductToEdit(product);
    openRemoveModel();
  };
  /*RENDER */
  const productColorList = colors.map((color) => (
    <CircelColor key={color} color={color} />
  ));

  return (
    <>
      <div className="  border flex flex-col rounded-md m-5 p-2 ">
        <Image
          className="rounded-md w-full img-height "
          alt="product name"
          imageUrl={imageURL}
        />
        <h1>{title}.</h1>
        <p>{textCut(description)}</p>
        <div className="flex justify-between items-center">
          <span>${price}</span>
          <div className="category-inf flex items-center space-x-3">
            <span>{category.name}</span>
            <Image
              imageUrl={category.imageURL}
              alt={category.name}
              className="w-8 h-8 rounded-full object-bottom"
            />
          </div>
        </div>
        <div className="flex flex-wrap space-x-1 items-center">
          {!colors.length ? (
            <p className="min-h-[20px]">Not available colors!</p>
          ) : (
            productColorList
          )}
        </div>
        <div className="flex justify-between space-x-2  mt-5">
          <Button
            onClick={() => {
              onEdit(product);
            }}
            className="bg-blue-700 "
          >
            EDIT
          </Button>
          <Button onClick={() => onRemove(product)} className="bg-red-700">
            Remove
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
