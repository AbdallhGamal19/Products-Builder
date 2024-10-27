import "../src/App.css";
import { v4 as uuid } from "uuid";
import { ChangeEvent, FormEvent, useState } from "react";
import ProductCard from "./components/ProductCard.tsx";
import Modal from "./components/ui/Modal.tsx";
import {
  productList,
  formInputsList,
  colors,
  categories,
} from "./data/index.ts";
import Button from "../src/components/ui/Button.tsx";
import Input from "../src/components/ui/Input.tsx";
import { IProduct } from "./interfaces/index.ts";
import { productValidation } from "./validation/index.ts";
import ErrorMessage from "./components/ErrorMessage.tsx";
import CircelColor from "./components/ui/CircelColor.tsx";
import SelectMenu from "./components/ui/SelectMenu.tsx";
import { ProductNameTypes } from "./tayps/index.ts";
import toast, { Toaster } from "react-hot-toast";
const App = () => {
  /*STATE */
  const productDefault = {
    title: "",
    description: "",
    imageURL: "",
    price: "",
    colors: [],
    category: {
      name: "",
      imageURL: "",
    },
  };
  const [products, setProducts] = useState<IProduct[]>(productList);
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<IProduct>(productDefault);
  const [productToEdit, setProductToEdit] = useState<IProduct>(productDefault);
  const [productToEditIdx, setProductToEditIdx] = useState<number>(0);
  const [isOpenEditModel, setisOpenEditModel] = useState(false);
  const [tempColor, setTempColor] = useState<string[]>([]);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    imageURL: "",
    price: "",
  });
  const [categorySelected, setCategorySelected] = useState(categories[0]);
  const [isOpenRemoveModel, setisOpenRemoveModel] = useState(false);
  /*HANDLER */
  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };
  const openEditModel = () => {
    setisOpenEditModel(true);
  };

  const closeEditModel = () => {
    setisOpenEditModel(false);
  };
  const openRemoveModel = () => {
    setisOpenRemoveModel(true);
  };

  const closeRemoveModel = () => {
    setisOpenRemoveModel(false);
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setProduct({
      ...product,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };
  const onChangeEditHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    console.log(value, name);
    setProductToEdit({
      ...productToEdit,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };
  const onCancel = (): void => {
    close();
    setProduct(productDefault);
  };

  const hasError = (errors: object): boolean => {
    return (
      Object.values(errors).some((value) => value == "") &&
      Object.values(errors).every((value) => value == "")
    );
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>): void => {
    const { title, description, price, imageURL } = product;
    event.preventDefault();
    const errors = productValidation({
      title,
      description,
      price,
      imageURL,
    });
    if (!hasError(errors)) {
      setErrors(errors);
      return;
    }

    setProducts((prev) => [
      {
        ...product,
        id: uuid(),
        colors: tempColor,
        category: { ...categorySelected },
      },
      ...prev,
    ]);
    setProduct(productDefault);

    setTempColor([]);
    close();
    toast("Product has been added successfully!", {
      icon: "👏",
      style: {
        backgroundColor: "black",
        color: "white",
      },
    });
  };
  const submitEditHandler = (event: FormEvent<HTMLFormElement>): void => {
    const { title, description, price, imageURL } = productToEdit;
    event.preventDefault();
    const errors = productValidation({
      title,
      description,
      price,
      imageURL,
    });
    if (!hasError(errors)) {
      setErrors(errors);
      toast("Product has been updated successfully!", {
        icon: "👏",
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
      return;
    }
    const updatedproducts = [...products];
    updatedproducts[productToEditIdx] = {
      ...productToEdit,
      colors: tempColor.concat(productToEdit.colors),
    };
    setProducts(updatedproducts);
    setProductToEdit(productDefault);
    setTempColor([]);
    closeEditModel();
    toast("Product has been updated successfully!", {
      icon: "👏",
      style: {
        backgroundColor: "black",
        color: "white",
      },
    });
  };
  const removeProductHandler = () => {
    const productAfterRemove = products.filter(
      (product) => product.id !== productToEdit.id
    );
    setProducts(productAfterRemove);
    closeRemoveModel();
    toast("Product has been deleted successfully!", {
      icon: "👏",
      style: {
        backgroundColor: "#c2344d",
        color: "white",
      },
    });
  };
  /*RENDER */
  const renderProductList = products.map((product, idx) => (
    <ProductCard
      key={product.id}
      product={product}
      setProductToEdit={setProductToEdit}
      openEditModel={openEditModel}
      openRemoveModel={openRemoveModel}
      setProductToEditIdx={setProductToEditIdx}
      idx={idx}
    />
  ));
  const renderFormInputList = formInputsList.map((input) => (
    <div className="flex flex-col" key={input.id}>
      <label className="mb-[3px]" htmlFor={input.id}>
        {input.label}
      </label>

      <Input
        type="text"
        name={input.name}
        id={input.id}
        value={product[input.name]}
        onChange={onChangeHandler}
      />
      <ErrorMessage message={errors[input.name]} />
    </div>
  ));

  const productColorList = colors.map((color) => (
    <CircelColor
      key={color}
      color={color}
      onClick={() => {
        if (tempColor.includes(color)) {
          setTempColor((prev) => prev.filter((item) => item !== color));
          return;
        }

        if (productToEdit.colors.includes(color)) {
          const colorEdit: string[] = productToEdit.colors.filter(
            (item) => item !== color
          );
          setProductToEdit({ ...productToEdit, colors: colorEdit });
          return;
        }
        setTempColor((prev) => [...prev, color]);
      }}
    />
  ));
  const colorSelected = tempColor.map((color) => (
    <span
      key={color}
      className="p-1 mr-1 mb-1 text-xs rounded-md text-white"
      style={{ backgroundColor: color }}
    >
      {color}
    </span>
  ));
  const renderProductEditWithWrrorMsg = (
    id: string,
    label: string,
    name: ProductNameTypes
  ) => {
    return (
      <div className="flex flex-col">
        <label className="mb-[3px]" htmlFor={id}>
          {label}
        </label>

        <Input
          type="text"
          name={name}
          id={id}
          value={productToEdit[name]}
          onChange={onChangeEditHandler}
        />
        <ErrorMessage message={errors[name]} />
      </div>
    );
  };

  return (
    <main className="container">
      <Button
        className="block mx-auto bg-indigo-700 hover:bg-indigo-800  my-10 px-10 font-medium"
        onClick={open}
        width="w-fit"
      >
        Build a Product
      </Button>
      <div className=" m-5 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {renderProductList}
      </div>
      {/* add Product model*/}
      <Modal isOpen={isOpen} close={close} title="ADD A NEW PRODUCT">
        <form className="space-y-3" onSubmit={submitHandler}>
          {renderFormInputList}
          <SelectMenu
            selected={categorySelected}
            setSelected={setCategorySelected}
          />
          <div className="flex flex-wrap space-x-1 items-center">
            {productColorList}
          </div>
          <div className="flex items-center flex-wrap ">{colorSelected}</div>

          <div className="flex justify-center space-x-3">
            <Button className="bg-indigo-700 hover:bg-indigo-800">
              SUBMIT
            </Button>
            <Button
              className="bg-[#f5f5fa] hover:bg-gray-300 !text-black"
              onClick={onCancel}
            >
              CANCEL
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Product model*/}
      <Modal
        isOpen={isOpenEditModel}
        close={closeEditModel}
        title="EDIT THIS PRODUCT"
      >
        <form className="space-y-3" onSubmit={submitEditHandler}>
          {renderProductEditWithWrrorMsg("title", "Product Title", "title")}
          {renderProductEditWithWrrorMsg(
            "description",
            "Product Description",
            "description"
          )}
          {renderProductEditWithWrrorMsg(
            "imageURL",
            "Product Image URL",
            "imageURL"
          )}
          {renderProductEditWithWrrorMsg("price", "Product Price", "price")}
          <SelectMenu
            selected={productToEdit.category}
            setSelected={(category) =>
              setProductToEdit({ ...productToEdit, category: category })
            }
          />
          <div className="flex flex-wrap space-x-1 items-center">
            {productColorList}
          </div>
          <div className="flex items-center flex-wrap ">
            {tempColor.concat(productToEdit.colors).map((color) => (
              <span
                key={color}
                className="p-1 mr-1 mb-1 text-xs rounded-md text-white"
                style={{ backgroundColor: color }}
              >
                {color}
              </span>
            ))}
          </div>
          <div className="flex justify-center space-x-2">
            <Button className="bg-indigo-700 hover:bg-indigo-800">
              SUBMIT
            </Button>
            <Button
              className="bg-[#f5f5fa] hover:bg-gray-300 !text-black"
              onClick={onCancel}
            >
              CANCEL
            </Button>
          </div>
        </form>
      </Modal>
      {/* delete product model */}
      <Modal
        isOpen={isOpenRemoveModel}
        close={closeRemoveModel}
        title="Are you sure you want to remove this Product from your Store?"
        description="Deleting this product will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex justify-center space-x-2">
          <Button
            onClick={removeProductHandler}
            className="bg-[#c2344d] hover:bg-red-800"
          >
            Yes, remove
          </Button>
          <Button
            onClick={closeRemoveModel}
            type="button"
            className="bg-[#f5f5fa] hover:bg-gray-300 !text-black"
          >
            CANCEL
          </Button>
        </div>
      </Modal>
      <Toaster />
    </main>
  );
};

export default App;
