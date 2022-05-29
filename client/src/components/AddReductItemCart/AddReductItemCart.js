import "./AddReductItemCart.css";
import { useContext } from "react";
import MyContext from "../../MyContext";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Typography from "@mui/material/Typography";

function AddReductItemCart({ _id, quantity }) {
  const [, , addItemQuantity, removeItemQuantity] = useContext(MyContext);

  return (
    <ButtonGroup
      size="small"
      variant="outlined"
      aria-label="outlined button group"
    >
      <Button
        onClick={() => {
          removeItemQuantity(_id);
        }}
      >
        <RemoveIcon fontSize="small" />
      </Button>

      <Button disabled sx={{ p: 0, width: "auto" }}>
        <Typography
          sx={{ color: "#757575", fontSize: 14, fontWeight: "small", m: 0 }}
          variant="caption"
          display="block"
        >
          {quantity}
        </Typography>
      </Button>

      <Button
        onClick={() => {
          addItemQuantity(_id);
        }}
      >
        <AddIcon fontSize="small" />
      </Button>
    </ButtonGroup>
  );
}
export default AddReductItemCart;
