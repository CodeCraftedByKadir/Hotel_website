import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");
      const bookingId = searchParams.get("bookingId");

      if (!reference || !bookingId) {
        console.error("Missing reference or bookingId in URL");
        alert("Payment details missing.");
        navigate("/my-bookings");
        return;
      }

      try {
        console.log("Verifying payment with reference:", reference);
        // Verify payment directly with Paystack API (or skip if trusting callback)
        const response = await axios.post(
          `http://localhost:5000/api/bookings/${bookingId}/verify-payment`,
          { reference },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.message === "Payment verified") {
          navigate("/my-Bookings");
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

    verifyPayment();
  }, [navigate, searchParams]);

  return <p>Verifying payment, please wait...</p>;
};

export default PaymentCallback;
