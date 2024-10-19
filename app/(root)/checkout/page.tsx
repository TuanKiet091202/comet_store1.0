"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie
import useCart from "@/lib/hooks/useCart";

const AddressForm = () => {
   const router = useRouter();
   const cart = useCart();

   const [address, setAddress] = useState({
      street: "",
      city: "",
      state: "",
      country: "",
   });

   const [customer, setCustomer] = useState({});

   // Lấy thông tin customer từ cookie khi component mount
   useEffect(() => {
      const storedCustomer = Cookies.get("customer"); // Đọc cookie
      if (storedCustomer) {
         setCustomer(JSON.parse(storedCustomer));
      }
   }, []);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setAddress((prevAddress) => ({
         ...prevAddress,
         [name]: value,
      }));
      console.log("Updated Address:", { ...address, [name]: value });
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Lưu thông tin địa chỉ vào cookie
      Cookies.set("shippingAddress", JSON.stringify(address), { expires: 1, path: "/" });

      try {
         const res = await fetch("http://localhost:3030/create-payment-link", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
               orderCode: Number(Date.now().toString().slice(-6)),
               amount: 100000,
               description: 'Thanh toán đơn hàng',
               returnUrl: `/payment_success`,
               cancelUrl: `/cart`,
            }),
         });

         if (!res.ok) {
            const error = await res.text();
            console.error('Checkout failed:', error);
            throw new Error(`Checkout failed: ${error}`);
         }

         const data = await res.json();
         console.log('Checkout successful:', data);

         // Chuyển hướng đến link thanh toán nếu có
         if (data.paymentLink) {
            window.location.href = data.paymentLink; // Chuyển hướng đến link thanh toán
         } else {
            console.error('Payment link not found in response.');
            alert('Có lỗi xảy ra, không tìm thấy link thanh toán.');
         }
      } catch (error) {
         console.error('Checkout failed:', error);
         alert('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.');
      }
   };



   return (
      <div className="max-w-md mx-auto py-10">
         <h1 className="text-2xl font-bold mb-5">Shipping Address</h1>
         <form onSubmit={handleSubmit} className="space-y-4">
            <input
               type="text"
               name="street"
               placeholder="Street"
               value={address.street}
               onChange={handleChange}
               className="w-full p-2 border rounded"
               required
            />
            <input
               type="text"
               name="city"
               placeholder="City"
               value={address.city}
               onChange={handleChange}
               className="w-full p-2 border rounded"
               required
            />
            <input
               type="text"
               name="state"
               placeholder="State"
               value={address.state}
               onChange={handleChange}
               className="w-full p-2 border rounded"
               required
            />
            <input
               type="text"
               name="country"
               placeholder="Country"
               value={address.country}
               onChange={handleChange}
               className="w-full p-2 border rounded"
               required
            />
            <button
               type="submit"
               className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
               Proceed to Payment
            </button>
         </form>
      </div>
   );
};

export default AddressForm;
