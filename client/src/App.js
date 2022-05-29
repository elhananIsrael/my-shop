import "./App.css";
import { useEffect, useRef, useState } from "react";
import Products from "./components/Products";
import Loader from "./components/Loader/Loader";
import MyContext from "./MyContext";

function App() {
  const [productsArr, setProductsArr] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shipping, setShipping] = useState(9.99);

  const h1Ref = useRef(null);

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
    fetch("http://localhost:8000/products")
      .then((response) => {
        // console.log(response);
        return response.json();
      })
      .then((newArr) => {
        // let newArr = [...products];
        // for (let index = 0; index < newArr.length; index++) {
        //   newArr[index] = { ...products[index], quantity: 0 };
        // }
        // console.log(newArr);
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
      fetch(`http://localhost:8000/products/${_id}`, options)
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
      fetch(`http://localhost:8000/products/${_id}`, options)
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
    fetch(`http://localhost:8000/products/${_id}`, { method: "DELETE" })
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
    <MyContext.Provider
      value={[productsArr, setProductsArr, addItemQuantity, removeItemQuantity]}
    >
      <div className="container-fluid">
        <div className="block-heading">
          <h2>Shopping Cart</h2>
          <p>Everything here is of excellent quality and at a cheap price!</p>
        </div>
        <div className="row">
          <aside className="col-lg-3">
            <div className="card" style={{ position: "sticky", top: "0" }}>
              <div className="card-body">
                <dl className="dlist-align">
                  <dt>Total price:</dt>
                  <dd className="text-right ml-3">${totalPrice}</dd>
                </dl>
                <dl className="dlist-align">
                  <dt>Shipping:</dt>
                  <dd className="text-right ml-3">${shipping}</dd>
                </dl>
                <dl className="dlist-align">
                  <dt>Total:</dt>
                  <dd className="text-right text-dark b ml-3">
                    <strong>${total}</strong>
                  </dd>
                </dl>
                <hr />
                <span
                  style={{ pointerEvents: "none" }}
                  className="btn btn-out btn-success btn-square btn-main mt-2"
                >
                  Good Luck Shopping!
                </span>
              </div>
            </div>
          </aside>
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
                <h1 ref={h1Ref}>WELCOME!</h1>
                <Loader />
              </>
            )}
          </>
        </div>
      </div>
    </MyContext.Provider>
  );
}

export default App;
