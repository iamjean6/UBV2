import { useDispatch } from "react-redux";
import {
  decreaseQuantity,
  addToCart,
  removeFromCart,
} from "../store/cart";
import { ChevronLeft, ChevronRight, Trash } from "lucide-react";

export default function CartItem({ data }) {
  const { productId, variantId, size, color, quantity, name, image, price } = data;
  const dispatch = useDispatch();

  return (
    <div className="rounded-3xl border border-neutral-300 xl:w-11/12">
      <div className="flex flex-col gap-6 border-b border-neutral-300 px-4 py-6 sm:flex-row sm:items-center">
        <img
          className="mx-auto w-36 rounded-2xl bg-gray-300 p-4 sm:mx-0 sm:w-32"
          src={image || 'https://via.placeholder.com/150'}
          alt={name}
        />

        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold xl:text-2xl">
              {name}
            </h1>


            <button
              className="bx bx-trash cursor-pointer text-2xl text-red-600"
              onClick={() =>
                dispatch(removeFromCart({ productId, variantId, size, color }))
              }
            >
              <Trash />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold xl:text-xl">
              KES {price}
            </h1>

            <div className="flex h-11 items-center gap-4 rounded-3xl bg-gray-50 px-4">
              <button
                className="bx bx-minus cursor-pointer text-xl"
                onClick={() =>
                  dispatch(decreaseQuantity({ productId, variantId, size, color }))
                }
              >
                <ChevronLeft />
              </button>

              <span className="text-lg">{quantity}</span>

              <button
                className="bx bx-plus cursor-pointer text-xl"
                onClick={() =>
                  dispatch(addToCart({ productId, variantId, size, color, quantity: 1, name, image, price }))
                }
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}