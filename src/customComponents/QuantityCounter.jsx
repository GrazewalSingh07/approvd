import { Button, InputNumber } from "antd"; // Import Ant Design components

export const QuantityCounter = ({ quantity, setQuantity }) => {
  const increment = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
  };

  const decrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button onClick={decrement} type="default">
        -
      </Button>
      <InputNumber
        min={1}
        value={quantity}
        readOnly={true}
        className="text-center"
        style={{ width: "40px" }} // Adjust width as needed
      />
      <Button onClick={increment} type="default">
        +
      </Button>
    </div>
  );
};
