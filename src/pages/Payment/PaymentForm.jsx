// src/components/PaymentForm.jsx
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2"; 
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const location = useLocation();
    const { user, loading: userLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentPurpose, setPaymentPurpose] = useState("");
    const [specificItemId, setSpecificItemId] = useState(null);


    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const urlAmount = parseFloat(searchParams.get("amount"));
        const urlPaymentFor = searchParams.get("paymentFor");
        const urlItemId = searchParams.get("itemId");

        if (!isNaN(urlAmount) && urlAmount > 0 && urlPaymentFor) {
            setPaymentAmount(urlAmount);
            setPaymentPurpose(urlPaymentFor);
            setSpecificItemId(urlItemId);
        } else {
            Swal.fire({
                icon: "error",
                title: "Payment Details Missing!",
                text: "Required payment details are missing or invalid. Please go back and select a valid item.",
                confirmButtonText: "OK"
            }).then(() => {
                navigate('/subscription'); 
            });
        }
    }, [location.search, navigate]);

    const amountInCents = Math.round(paymentAmount * 100);
 
    useEffect(() => {
        if (userLoading || !user?.email || amountInCents <= 0 || isProcessingPayment) {
            return;
        }

        setIsProcessingPayment(true);

        axiosSecure.post("/create-payment-intent", { amountInCents, email: user.email })
            .then(res => {
                setClientSecret(res.data.clientSecret);
                setIsProcessingPayment(false);
            })
            .catch(err => {
                console.error("Error creating payment intent:", err);
                setError("Failed to initialize payment. Please try again.");
                setIsProcessingPayment(false);
                setClientSecret("");
            });
    }, [amountInCents, user, userLoading, axiosSecure]); 

    if (userLoading || (isProcessingPayment && !clientSecret && amountInCents > 0)) {
        return <LoadingSpinner />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessingPayment(true);

        if (!stripe || !elements) {
            setIsProcessingPayment(false);
            return;
        }

        const card = elements.getElement(CardElement);
        if (!card) {
            setError("Card information is missing. Please enter your card details.");
            setIsProcessingPayment(false);
            return;
        }

        const { error: createPaymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card,
        });

        if (createPaymentMethodError) {
            setError(createPaymentMethodError.message);
            setIsProcessingPayment(false);
            return;
        } else {
            setError("");
            console.log("Payment Method created:", paymentMethod);
        }

        const { error: confirmPaymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: user?.displayName || 'Anonymous User',
                    email: user?.email,
                },
            },
        });

        if (confirmPaymentError) {
            setError(confirmPaymentError.message);
            setIsProcessingPayment(false);
            return;
        } else {
            setError("");
        }

        if (paymentIntent.status === "succeeded") {
            console.log("Payment succeeded!", paymentIntent);
            const transactionId = paymentIntent.id;

            const paymentData = {
                email: user.email,
                amount: paymentAmount,
                transactionId: transactionId,
                paymentDate: new Date(),
                paymentPurpose: paymentPurpose,
                specificItemId: specificItemId,
                paymentMethod: paymentIntent.payment_method_types[0],
                status: 'completed'
            };

            try {
                const res = await axiosSecure.post("/payments", paymentData);

                if (res.data.success) {
                    await Swal.fire({
                        icon: "success",
                        title: "Payment Successful!",
                        html: `Your payment for <strong>${paymentPurpose}</strong> is complete.<br><strong>Transaction ID:</strong> <code>${transactionId}</code>`,
                        confirmButtonText: "Done",
                    });

                    if (paymentPurpose === 'subscription') {
                        navigate("/premium-article");
                    } else if (paymentPurpose === 'parcel_fee') {
                        navigate("/dashboard/my-profile");
                    } else {
                        navigate("/dashboard");
                    }
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: "Payment Recorded, But Update Failed",
                        text: res.data.message || "Payment was successful, but there was an issue updating your status. Please contact support.",
                    });
                }
            } catch (err) {
                console.error("Error saving payment info or updating status:", err);
                Swal.fire({
                    icon: "error",
                    title: "Transaction Error!",
                    text: "An error occurred while finalizing your payment. Please contact support.",
                });
            }
        } else {
            Swal.fire({
                icon: "info",
                title: "Payment Status:",
                text: `Payment is ${paymentIntent.status}. It might require further action or be processing.`,
            });
        }
        setIsProcessingPayment(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
                    Complete Your Payment
                </h2>
                <div className="mb-6 text-center">
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Payment For: <span className="font-bold text-blue-600 dark:text-blue-400">{paymentPurpose || 'N/A'}</span>
                    </p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                        Amount Due: ${paymentAmount.toFixed(2)}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#aab7c4',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!stripe || !elements || isProcessingPayment || !clientSecret || paymentAmount <= 0}
                    >
                        {isProcessingPayment ? <LoadingSpinner size="sm" /> : `Pay $${paymentAmount.toFixed(2)}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;