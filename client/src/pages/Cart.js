import Loader from "../components/Loader/Loader";
import Products from "../components/Products";

function Cart({ h1Ref, productsArr, removeProduct }) {
  return (
    <>
      {productsArr.length > 0 ? (
        <>
          <Products
            products_products={productsArr}
            removeProduct={removeProduct}
          />
        </>
      ) : (
        <>
          <h1 style={{ position: "absolute", left: "43%" }} ref={h1Ref}>
            WELCOME!
          </h1>
          <Loader />
        </>
      )}
    </>
  );
}

export default Cart;
