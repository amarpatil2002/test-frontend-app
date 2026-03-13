import { useEffect, useState } from "react";

export default function PaymentStatus() {
  const [status, setStatus] = useState("loading");

  const BACKEND_URL = "https://payment-gatway-1.onrender.com";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");

    if (!orderId) {
      setStatus("failed");
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/status/${orderId}`);
        const data = await res.json();

        console.log("Payment status:", data);

        const paymentStatus = data?.data?.status;

        if (paymentStatus === "success" || paymentStatus === "SUCCESS") {
          setStatus("success");
          clearInterval(interval);
        }

        if (paymentStatus === "failed" || paymentStatus === "FAILED") {
          setStatus("failed");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Status check error:", err);
        clearInterval(interval);
        setStatus("failed");
      }
    }, 2000); // check every 2 seconds

    return () => clearInterval(interval);
  }, []);

  if (status === "loading") return <h2>Checking payment status...</h2>;
  if (status === "success") return <h2>Payment Successful 🎉</h2>;
  if (status === "failed") return <h2>Payment Failed ❌</h2>;

  return <h2>Payment Processing...</h2>;
}
