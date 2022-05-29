function ProductSummary({ totalPrice, shipping, total }) {
  return (
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
  );
}

export default ProductSummary;
