import "./App.css";
import { React, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyContext from "./MyContext";
import Head from "./components/Head";
import ProductSummary from "./components/ProductSummary";
import Cart from "./pages/Cart";

function App() {
  const [productsArr, setProductsArr] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shipping, setShipping] = useState(9.99);

  const getIndex = (arr, key) => {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]._id === key) {
        return i;
      }
    }
    return -1; //to handle the case where the value doesn't exist
  };

  const updateProductSummary = (cartArr) => {
    let tempNumProductsCart = 0;
    let tempTotalPrice = 0;
    let tempShipping = 9.99;
    let tempTotal = 0;
    for (let index = 0; index < cartArr.length; index++) {
      if (cartArr[index].quantity > 0) {
        tempNumProductsCart++;
        tempTotalPrice += +(
          cartArr[index].quantity * cartArr[index].price
        ).toFixed(2);
      }
    }
    if (tempNumProductsCart > 4) {
      tempShipping = 9.99 + 9.99;
    }
    if (tempNumProductsCart === 0) tempTotal = 0;
    else tempTotal = +(tempTotalPrice + tempShipping).toFixed(2);
    setTotalPrice(tempTotalPrice.toFixed(2));
    setShipping(tempShipping.toFixed(2));
    setTotal(tempTotal.toFixed(2));
  };

  const getAllProductsFromServer = () => {
    fetch("/api/products")
      .then((response) => {
        // console.log(response);
        return response.json();
      })
      .then((newArr) => {
        setProductsArr(newArr);
        updateProductSummary(newArr);
      })
      .catch((error) => {
        console.log("fetch error", error);
      });
  };

  const addItemQuantity = (_id) => {
    let cartProduct = null;
    productsArr
      .filter((product) => product._id === _id)
      .map((item) => {
        cartProduct = item;
        return true;
      });
    let cartProductIndex = null;
    if (cartProduct !== null) {
      cartProductIndex = getIndex(productsArr, _id);
      const newQuantity = cartProduct.quantity + 1;
      const newCartItem = { ...cartProduct, quantity: newQuantity };
      let newCartArr = [...productsArr];
      newCartArr[cartProductIndex] = newCartItem;
      setProductsArr(newCartArr);
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      };
      fetch(`/api/products/${_id}`, options)
        .then((response) => {
          // console.log(response);
          return response.json();
        })
        .then((result) => {
          // console.log(result);
          updateProductSummary(newCartArr);
        })
        .catch((error) => {
          console.log("fetch error", error);
        });
    }
  };

  const removeItemQuantity = (_id) => {
    let cartProduct = null;
    productsArr
      .filter((product) => product._id === _id)
      .map((item) => {
        cartProduct = item;
        return true;
      });
    let cartProductIndex = null;
    if (cartProduct !== null) {
      cartProductIndex = getIndex(productsArr, _id);
      // console.log(cartProductIndex);
    }
    if (cartProduct != null && cartProduct.quantity >= 1) {
      const newQuantity = cartProduct.quantity - 1;
      const newCartItem = { ...cartProduct, quantity: newQuantity };
      let newCartArr = [...productsArr];
      newCartArr[cartProductIndex] = newCartItem;
      setProductsArr(newCartArr);
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      };
      fetch(`/api/products/${_id}`, options)
        .then((response) => {
          // console.log(response);
          return response.json();
        })
        .then((result) => {
          // console.log(result);
          updateProductSummary(newCartArr);
        })
        .catch((error) => {
          console.log("fetch error", error);
        });
    }
  };

  const removeProduct = (_id) => {
    fetch(`/api/products/${_id}`, { method: "DELETE" })
      .then((response) => {
        // console.log(response);
        return response.json();
      })
      .then((result) => {
        let newCartArr = [...productsArr];
        setProductsArr(newCartArr.filter((product) => product._id !== _id));
        updateProductSummary(
          newCartArr.filter((product) => product._id !== _id)
        );
        if (newCartArr.filter((product) => product._id !== _id).length === 0) {
          setTimeout(getAllProductsFromServer, 5000);
        }
      })
      .catch((error) => {
        console.log("fetch error", error);
      });
  };

  useEffect(() => {
    // console.log(productsArr);
    getAllProductsFromServer();
  }, []);

  return (
    <Router>
      <MyContext.Provider
        value={[
          productsArr,
          setProductsArr,
          addItemQuantity,
          removeItemQuantity,
        ]}
      >
        <div className="container-fluid">
          <Head />
          <div className="row">
            <ProductSummary
              totalPrice={totalPrice}
              shipping={shipping}
              total={total}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <Cart
                    productsArr={productsArr}
                    removeProduct={removeProduct}
                  />
                }
              />
            </Routes>
          </div>
        </div>
      </MyContext.Provider>
    </Router>
  );
}

export default App;
