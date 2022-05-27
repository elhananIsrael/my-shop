import "./App.css";
import { useEffect, useRef, useState } from "react";
import Products from "./components/Products";
import Loader from "./components/Loader/Loader";
import MyContext from "./MyContext";

let numProductsCart = 0;

function App() {
  const [productsArr, setProductsArr] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shipping, setShipping] = useState(9.99);

  const h1Ref = useRef(null);

  const getIndex = (arr, key) => {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === key) {
        return i;
      }
    }
    return -1; //to handle the case where the value doesn't exist
  };

  const addItemQuantity = (id) => {
    let cartProduct = null;
    productsArr
      .filter((product) => product.id === id)
      .map((item) => {
        cartProduct = item;
        return true;
      });
    let cartProductIndex = null;
    if (cartProduct !== null) {
      cartProductIndex = getIndex(productsArr, id);
      let tempShipping = shipping;
      let tempTotalPrice = totalPrice;
      let tempTotal = total;
      if (cartProduct.quantity === 0) {
        numProductsCart++;
        if (numProductsCart === 5) {
          tempShipping = shipping + 9.99;
          setShipping(tempShipping);
        }
      }
      const newQuantity = cartProduct.quantity + 1;
      const newCartItem = { ...cartProduct, quantity: newQuantity };
      let newCartArr = [...productsArr];
      newCartArr[cartProductIndex] = newCartItem;
      setProductsArr(newCartArr);
      tempTotalPrice = +(totalPrice + cartProduct.price).toFixed(2);
      setTotalPrice(tempTotalPrice);
      tempTotal = +(tempShipping + tempTotalPrice).toFixed(2);
      if (numProductsCart === 0) tempTotal = 0;
      setTotal(tempTotal);
    }
  };

  const removeItemQuantity = (id) => {
    let cartProduct = null;
    productsArr
      .filter((product) => product.id === id)
      .map((item) => {
        cartProduct = item;
        return true;
      });
    let cartProductIndex = null;
    if (cartProduct !== null) {
      cartProductIndex = getIndex(productsArr, id);
      // console.log(cartProductIndex);
    }
    if (cartProduct != null && cartProduct.quantity >= 1) {
      let tempShipping = shipping;
      let tempTotalPrice = totalPrice;
      let tempTotal = total;
      if (cartProduct.quantity === 1) {
        numProductsCart--;
        if (numProductsCart === 4) {
          tempShipping = shipping - 9.99;
          setShipping(shipping - 9.99);
        }
      }
      const newQuantity = cartProduct.quantity - 1;
      const newCartItem = { ...cartProduct, quantity: newQuantity };
      let newCartArr = [...productsArr];
      newCartArr[cartProductIndex] = newCartItem;
      setProductsArr(newCartArr);
      tempTotalPrice = +(totalPrice - cartProduct.price).toFixed(2);
      setTotalPrice(tempTotalPrice);
      tempTotal = +(tempShipping + tempTotalPrice).toFixed(2);
      if (numProductsCart === 0) tempTotal = 0;
      setTotal(tempTotal);
    }
  };

  const removeProduct = (id, quantity, price) => {
    let newCartArr = [...productsArr];
    setProductsArr(newCartArr.filter((product) => product.id != id));
    let tempShipping = shipping;
    let tempTotalPrice = totalPrice;
    let tempTotal = total;
    numProductsCart--;
    if (numProductsCart === 4) {
      tempShipping = shipping - 9.99;
      setShipping(shipping - 9.99);
    }
    tempTotalPrice = +(totalPrice - quantity * price).toFixed(2);
    setTotalPrice(tempTotalPrice);
    tempTotal = +(tempShipping + tempTotalPrice).toFixed(2);
    if (numProductsCart === 0) tempTotal = 0;
    setTotal(tempTotal);
    // console.log(
    //   "productsArr",
    //   newCartArr.filter((product) => product.id != id)
    // );
  };

  useEffect(() => {
    // console.log(productsArr);
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((products) => {
        let newArr = [...products];
        for (let index = 0; index < newArr.length; index++) {
          newArr[index] = { ...products[index], quantity: 0 };
        }
        // console.log(newArr);
        setProductsArr(newArr);
      })
      .catch((error) => {
        console.log("fetch error", error);
      });
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
            <div className="card">
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
                <button
                  type="button"
                  className="btn btn-out btn-success btn-square btn-main mt-2"
                >
                  Checkout
                </button>
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
