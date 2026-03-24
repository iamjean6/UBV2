import { useSelector, useDispatch } from "react-redux";
import { toggleStatusTab } from "../store/cart";
import { useEffect, useRef } from "react";
import CartItem from "./cartitem";
import CartSummary from "./cartsummary";
import { HiX, HiXCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const drawerRef = useRef();
  const navigate = useNavigate()

  const { statusTab, items } = useSelector((state) => state.cart);

  const closeDrawer = () => {
    dispatch(toggleStatusTab());
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target)
      ) {
        dispatch(toggleStatusTab());
      }
    };

    if (statusTab) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [statusTab, dispatch]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        dispatch(toggleStatusTab());
      }
    };

    if (statusTab) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [statusTab, dispatch]);

  const goToShop = () => {
    navigate("/merch")
  }
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${statusTab ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      />

      {/* DRAWER */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-[90%] sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${statusTab ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button
            onClick={closeDrawer}
            className="text-2xl font-bold hover:text-red-600"
          >
            <HiX />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-80px)]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="relative min-h-[60vh] flex items-center justify-center">
                <div className="  rounded-2xl p-8 flex flex-col items-center space-y-1">
                  <img
                    src="/videos/sad.gif"
                    alt="Empty cart"
                    className="w-72 h-72 animate-pulse object-contain rounded-sm "
                  />
                  <p className="text-gray-500 text-xl font-medium text-center">
                    Your cart is empty
                  </p>
                  <button onClick={goToShop}>
                    <span className="underline hover:cursor-pointer font-zentry hover:text-orange-600">Visit our shop</span>
                  </button>
                </div>

              </div>

            ) : (
              items.map((item) => (
                <CartItem key={item.productId} data={item} />
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 border-t">
              <CartSummary />
            </div>
          )}
        </div>
      </div>
    </>
  );
}