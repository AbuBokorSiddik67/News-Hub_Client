// src/components/Payment.jsx
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentForm from "./PaymentForm"; 
import { Helmet } from "react-helmet";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_Pub_KEY);

const Payment = () => {
    return (
        <Elements stripe={stripePromise}>
            <Helmet><title>Payment</title></Helmet>
            <PaymentForm />
        </Elements>
    );
};

export default Payment;