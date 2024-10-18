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
      setAddress({
         ...address,
         [e.target.name]: e.target.value,
      });

      console.log("Updated Address:", address);
   };

   // Kiểm tra lại cookie sau khi lưu
   useEffect(() => {
      const shippingAddress = Cookies.get("shippingAddress");
      console.log("Shipping Address from Cookie:", shippingAddress);
   }, []);


   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Lưu thông tin địa chỉ vào cookie
      Cookies.set("shippingAddress", JSON.stringify(address), { expires: 1, path: "/" });

      try {
         const customer = Cookies.get('customer');
         const cartItems = Cookies.get('cartItems');
         const shippingAddress = Cookies.get('shippingAddress');

         console.log('Customer:', JSON.parse(customer || '{}'));
         console.log('Cart Items:', JSON.parse(cartItems || '[]'));
         console.log('Shipping Address:', JSON.parse(shippingAddress || '{}'));

         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
               customer: JSON.parse(customer || '{}'),
               cartItems: JSON.parse(cartItems || '[]'),
               shippingAddress: JSON.parse(shippingAddress || '{}'),
            }),
         });

         if (!res.ok) {
            throw new Error(`Checkout failed: ${res.statusText}`);
         }

         const data = await res.json();
         console.log('Checkout successful:', data);
         window.location.href = data.paymentLink;
      } catch (error) {
         console.error('Checkout failed:', error);
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
