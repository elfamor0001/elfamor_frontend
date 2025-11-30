export function calculateShipping(subtotal) {
  const FREE_SHIPPING_THRESHOLD = 3000;
  const SHIPPING_CHARGE = 70;
  const freeShippingEligible = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipmentCharge = freeShippingEligible ? 0 : SHIPPING_CHARGE;
  const total = subtotal + shipmentCharge;
  const amountNeeded = freeShippingEligible ? 0 : FREE_SHIPPING_THRESHOLD - subtotal;
  return { subtotal, shipmentCharge, total, freeShippingEligible, amountNeeded };
}