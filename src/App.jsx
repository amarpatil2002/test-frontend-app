import { useEffect } from "react";
import "./App.css";
import { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";

const BACKEND_URL = "https://payment-gatway-1.onrender.com";

function App() {
  const [plan, setPlan] = useState([]);

  const startPayment = async (sessionId) => {
    const cashfree = await load({
      mode: "production",
    });

    cashfree.checkout({
      paymentSessionId: sessionId,
      redirectTarget: "_modal",
    });
  };

  const fetchPlans = async () => {
    const response = await fetch(`${BACKEND_URL}/api/all-plans`);
    const res = await response.json();
    console.log(res.data.plans);
    setPlan(res.data.plans);
  };

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
      console.log(data);
      if (data.success) {
        startPayment(data.paymentSessionId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlans();
    console.log(plan);
  }, []);

  return (
    <>
      <h2>Payment Gateway Plans</h2>

      <div className="plan-container">
        {plan.map((plan) => (
          <div className="plan-card" key={plan._id}>
            <h3>{plan.name}</h3>
            <p>{plan.description}</p>
            <p>Credits: {plan.credits}</p>
            <p>Validity: {plan.validityDays || "unlimited"}</p>
            <p className="plan-price">₹{plan.price}</p>

            <button onClick={() => handleBuyPlan(plan)} className="buy-btn">
              Buy Plan
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
