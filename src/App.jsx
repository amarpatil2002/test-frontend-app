import { useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import "./App.css";

const BACKEND_URL = "https://theserene.studio";
// const BACKEND_URL = "https://payment-gatway-1.onrender.com";
// const BACKEND_URL = "http://localhost:5000";

function App() {
  const [plans, setPlans] = useState([]);

  // Load Cashfree only once
  const cashfreePromise = load({
    mode: "production",
  });

  const fetchPlans = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/client/subscription/my-subscription`,
      );
      const data = await response.json();

      console.log("Plans:", data);

      setPlans(data.data.plans);
    } catch (error) {
      console.error("Fetch plans error:", error);
    }
  };

  /* ---------- START PAYMENT ---------- */

  const startPayment = async (sessionId) => {
    try {
      if (!sessionId) {
        alert("Invalid payment session");
        return;
      }

      const cashfree = await cashfreePromise;

      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_self",
      };

      await cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Unable to open payment gateway.");
    }
  };

  /* ---------- BUY PLAN ---------- */

  const handleBuyPlan = async (plan) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/client/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: plan._id,
            userId: "69b0fd2df3bb7de5fb96dba2",
            phone: "7666225895",
          }),
        },
      );

      const data = await response.json();
      console.log("Full API response:", data);

      if (!data.success) {
        alert("Unable to start payment.");
        return;
      }

      // Get session id safely
      const sessionId =
        data.paymentSessionId ||
        data.data?.paymentSessionId ||
        data.payment_session_id;

      if (!sessionId) {
        alert("Payment session expired. Please try again.");
        return;
      }

      console.log("Valid session:", sessionId);

      startPayment(sessionId);
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="container">
      <h2>Payment Gateway Plans</h2>

      <div className="plan-container">
        {plans.map((plan) => (
          <div className="plan-card" key={plan._id}>
            <h3>{plan.name}</h3>

            <p>{plan.description}</p>

            <p>Credits: {plan.credits}</p>

            <p>Validity: {plan.validityDays || "Unlimited"}</p>

            <p className="plan-price">₹{plan.price}</p>

            <button className="buy-btn" onClick={() => handleBuyPlan(plan)}>
              Buy Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
