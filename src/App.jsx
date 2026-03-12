import { useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import "./App.css";

const BACKEND_URL = "https://payment-gatway-1.onrender.com";

function App() {
  const [plans, setPlans] = useState([]);

  // Load Cashfree only once
  const cashfreePromise = load({
    mode: "production",
  });

  /* ---------- FETCH PLANS ---------- */

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/all-plans`);
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
        console.error("Invalid payment session id");
        return;
      }

      const cashfree = await cashfreePromise;

      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_self",
      };

      cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  /* ---------- BUY PLAN ---------- */

  const handleBuyPlan = async (plan) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: plan._id,
          userId: "69b0fd2df3bb7de5fb96dba2",
          phone: "7666225895",
        }),
      });

      const data = await response.json();

      console.log("Create order response:", data);

      if (data.success) {
        const sessionId = data.paymentSessionId;

        console.log("Session ID:", sessionId);

        startPayment(sessionId);
      } else {
        console.error("Order creation failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  /* ---------- LOAD PLANS ---------- */

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
