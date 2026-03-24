import { Outlet } from "react-router-dom";
import Navbar from "../UI/navbar";
import Footer from "./footer";
import Cart from "../UI/cart"
import AuthModal from "./Auth/AuthModal";
import { useSelector, useDispatch } from "react-redux";
import { toggleAuthModal } from "../store/cart";

const Layout = () => {
  const dispatch = useDispatch();
  const isAuthModalOpen = useSelector(state => state.cart.isAuthModalOpen);

  return (
    <>
      <Navbar />
      <Cart />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => dispatch(toggleAuthModal())}
      />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
