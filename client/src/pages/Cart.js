import { useEffect, useState, useRef } from "react";
import Loader from "../components/Loader/Loader";
import Products from "../components/Products";

const myDate = () => {
  const date = new Date();
  const hours = date.getHours();
  let timeOfDay;
  if (hours < 12) {
    timeOfDay = "Morning";
  } else if (hours >= 12 && hours < 17) {
    timeOfDay = "Afternoon";
  } else {
    timeOfDay = "Night";
  }
  return timeOfDay;
};

function Cart({ productsArr, removeProduct }) {
  const h1Ref = useRef();
  useEffect(() => {
    if ((h1Ref !== undefined || h1Ref !== null) && h1Ref.current) {
      h1Ref.current.innerHTML = `<h1>WELCOME!</h1><h2>Good ${myDate()}!</h2>`;
    }
  }, []);

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
          <div
            style={{
              position: "absolute",
              left: "43%",
              top: "27%",
              textAlign: "center",
            }}
            ref={h1Ref}
          >
            <h1>WELCOME!</h1>
          </div>
          <Loader />
        </>
      )}
    </>
  );
}

export default Cart;
