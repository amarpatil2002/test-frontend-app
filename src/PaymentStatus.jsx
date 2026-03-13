import { useEffect, useState } from "react";

export default function PaymentStatus() {
  const [status, setStatus] = useState("loading");

  const BACKEND_URL = "https://payment-gatway-1.onrender.com";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");

    if (!orderId) return;

    fetch(`${BACKEND_URL}/api/status/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data.status === "success") {
          setStatus("success");
        } else if (data.data.status === "failed") {
          setStatus("failed");
        } else {
          setStatus("pending");
        }
      });
  }, []);

  if (status === "loading") return <h2>Checking payment...</h2>;
  if (status === "success") return <h2>Payment Successful 🎉</h2>;
  if (status === "failed") return <h2>Payment Failed ❌</h2>;

  return <h2>Payment Processing...</h2>;
}
