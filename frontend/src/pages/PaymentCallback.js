import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../api/api"; // Ensure this is correctly imported

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyPaymentCall = async () => {
      const reference = searchParams.get("reference");
      const bookingId = searchParams.get("bookingId");
      const token = localStorage.getItem("token");

      if (!reference || !bookingId) {
        console.error("Missing reference or bookingId in URL");
        alert("Payment details missing.");
        navigate("/my-bookings");
        return;
      }

      try {
        console.log("Verifying payment with reference:", reference);
        const response = await verifyPayment(bookingId, reference, token);

        if (response.message === "Payment verified") {
          setTimeout(() => navigate("/my-bookings"), 2000); // Delay before redirect
        } else {
          throw new Error("Payment verification failed");
        }
      } catch (error) {
        console.error(
          "Verification error:",
          error.response?.data || error.message
        );
        alert(
          "Payment verification failed: " +
            (error.response?.data?.message || "Server error")
        );
        navigate("/my-bookings");
      }
    };

    verifyPaymentCall();
  }, [navigate, searchParams]);

  return <p>Verifying payment, please wait...</p>;
};

export default PaymentCallback;
