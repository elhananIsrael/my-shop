import AddReductItemCart from "./AddReductItemCart/AddReductItemCart";

function Product({ id, title, src, category, price, quantity, removeProduct }) {
  return (
    <tr>
      <td>
        <figure className="itemside align-items-center">
          <div className="aside">
            <img src={src} className="img-sm" />
          </div>
          <figcaption className="info">
            <a className="title text-dark" data-abc="true">
              {title}
            </a>
            <p className="text-muted small">CATEGORY: {category}</p>
          </figcaption>
        </figure>
      </td>
      <td style={{ verticalAlign: "middle" }}>
        <AddReductItemCart id={id} quantity={quantity} />
      </td>
      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
        <div className="price-wrap">
          <var className="price">${price}</var>
        </div>
      </td>
      <td className="text-right" style={{ verticalAlign: "middle" }}>
        <br />
        <button
          className="btn btn-light"
          data-abc="true"
          onClick={() => {
            removeProduct(id, quantity, price);
          }}
        >
          Remove
        </button>
      </td>
    </tr>
  );
}

export default Product;
