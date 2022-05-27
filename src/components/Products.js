import Product from "./Product";

function Products({ products_products, removeProduct }) {
  return (
    <aside className="col-lg-9">
      <div className="card">
        <div className="table-responsive">
          <table className="table table-borderless table-shopping-cart">
            <thead className="text-muted">
              <tr className="small text-uppercase">
                <th scope="col">Product</th>
                <th scope="col" width="120" style={{ textAlign: "center" }}>
                  Quantity
                </th>
                <th scope="col" width="120" style={{ textAlign: "center" }}>
                  Price
                </th>
                <th
                  scope="col"
                  className="text-right d-none d-md-block"
                  width="200"
                ></th>
              </tr>
            </thead>

            <tbody id="productsElements">
              {products_products.map((product) => (
                <Product
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  src={product.image}
                  category={product.category}
                  price={product.price}
                  quantity={product.quantity}
                  removeProduct={removeProduct}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </aside>
  );
}

export default Products;
