import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    console.log("Order ID:", orderId);

    // call backend to verify payment if needed
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Payment Processing...</h2>
      <p>Order ID: {orderId}</p>
    </div>
  );
}

export default PaymentStatus;
