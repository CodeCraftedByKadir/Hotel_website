import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    setLoading(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Send `paymentMethod.id` to your server for payment processing
    const response = await fetch("/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
    });

    const paymentResult = await response.json();

    if (paymentResult.error) {
      setError(paymentResult.error);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <div className="payment-container">
      <h2>Complete Your Payment</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success ? (
        <p style={{ color: "green" }}>Payment Successful! 🎉</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardElement className="card-element" />
          <button type="submit" disabled={!stripe || loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;
