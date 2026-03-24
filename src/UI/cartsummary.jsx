import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleAuthModal } from "../store/cart";

export default function CartSummary() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.cart.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  let subtotal = 0;
  let totalDiscount = 0;

  cartItems.forEach((item) => {
    const itemSubtotal = (item.originalPrice || item.price || 0) * (item.quantity || 1);
    const itemDiscount = ((item.originalPrice || item.price || 0) - (item.price || 0)) * (item.quantity || 1); 

    subtotal += itemSubtotal;
    totalDiscount += itemDiscount;
  });

  const deliveryFee = 0;
  const total = subtotal - totalDiscount + deliveryFee;

  return (
    <div className="rounded-3xl border border-neutral-300 p-4 xl:p-6 xl:w-full xl:h-94">
      <h1 className="mb-4 text-2xl font-semibold xl:text-3xl">
        Order Summary
      </h1>

      <div className="space-y-2 text-sm xl:text-base">
        <div className="flex justify-between">
          <p className="text-gray-600">Subtotal</p>
          <p className="font-semibold">KES {subtotal}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-gray-600">Total Item</p>
          <p className="font-semibold">{totalItems}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-gray-600">Discount</p>
          <p className="font-semibold text-red-600">
            KES {totalDiscount}
          </p>
        </div>

        <div className="flex justify-between border-b border-neutral-300 pb-4">
          <p className="text-gray-600">Delivery Fee</p>
          <p className="font-semibold">KES {deliveryFee}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-between text-lg font-semibold xl:text-xl">
        <p>Total</p>
        <p>KES {total}</p>
      </div>

      <button
        onClick={() => {
          if (isAuthenticated) {
            navigate('/checkout');
          } else {
            dispatch(toggleAuthModal());
          }
        }}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-3xl bg-black text-white transition-colors cursor-pointer hover:bg-gray-900"
      >
        Go to Checkout
        <i className="bx bx-arrow-right text-2xl"></i>
      </button>
    </div>
  );
}