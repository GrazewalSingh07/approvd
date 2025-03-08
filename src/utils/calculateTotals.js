export function calculateTotals(items) {
  if (!Array.isArray(items)) return;
  const price = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gstRate = price > 1000 ? 12 : 5;
  const gst = Math.ceil((gstRate / 100) * price);
  const shipping = price < 500 ? 100 : 0;
  const totalPrice = Math.ceil(price + gst + shipping);
  const values = { price, gst, shipping, totalPrice };
  return values;
}
