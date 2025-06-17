"use client"
import React, { useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { initiate } from '@/actions/useractions'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { fetchPayments, fetchUser } from '@/actions/useractions'
import { useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { notFound } from 'next/navigation'

const PaymentPage = ({ username }) => {
    const [paymentform, setPaymentform] = useState({name: "", message: "", amount: ""})
    const [currentUser, setcurrentUser] = useState({})
    const [payments, setPayments] = useState([])
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if(searchParams.get("paymentdone") == "true"){
            alert("Payment Successful, Thank you for the donation!")
        // toast('Thanks for your donation!', {
        //     position: "top-right",
        //     autoClose: 5000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //     theme: "light",
        //     transition: Bounce,
        //     });
        }
        router.push(`/${username}`)
     
    }, [])


    const handleChange = (e) => {
        setPaymentform({ ...paymentform, [e.target.name]: e.target.value })
        console.log(paymentform)
    }

    const getData = async () => {
        let u = await fetchUser(username)
        setcurrentUser(u)
        let dbpayments = await fetchPayments(username)
        setPayments(dbpayments)
        console.log(u, dbpayments)

    }

    const pay = async (amount) => {
        // Get the order Id 
        let a = await initiate(amount, username, paymentform)
        let orderId = a.id
        var options = {
            "key": currentUser.razorpayid, // Enter the Key ID generated from the Dashboard
            "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Get Me A Coffee", //your business name
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                "name": "Gaurav Kumar", //your customer's name
                "email": "gaurav.kumar@example.com",
                "contact": "9000090000" //Provide the customer's phone number for better conversion rates 
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        }

        var rzp1 = new Razorpay(options);
        rzp1.open();
    }

    return (
        <>
            {/* <button id="rzp-button1">Pay</button> */}
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>



            {/* @{username} */}
            <div className='cover w-full bg-red-50 relative'>
                <img className='object-cover w-full h-48 md:h-[350px] shadow-blue-700 shadow-sm' src={currentUser.coverpic} />
                <div className='absolute -bottom-20 right-[33%] md:right-[46%] border-white overflow-hidden border-2 rounded-full size-36'>
                    <img className='rounded-full object-cover size-36' width={128} height={128} src={currentUser.profilepic} alt="" />
                </div>
            </div>
            <div className="info flex justify-center items-center my-24 mb-32 flex-col gap-2">

                <div className='font-bold text-lg'>@{username}</div>
                <div className='text-slate-400'>
                    Let's help {username} to get a cup of Coffee !
                </div>
                <div>
                    {payments.length} Payments . {currentUser.username} has raised ₹{payments.reduce((acc, payment) => acc + payment.amount, 0)} so far.
                </div>
                <div className="payment flex gap-3 w-[80%] mt-11 flex-col md:flex-row">
                    <div className="supporters w-full md:w-1/2 bg-slate-900 rounded-lg text-white px-2 md:p-10">
                         {/* Show list of all the supporters as a leaderboard  */}
                        <h2 className='text-2xl font-bold my-5'> Top 10 Supporters</h2>
                        {payments.length == 0 && <div>No payments yet</div>}
                        <ul className='mx-5 text-lg'>
                            {payments.map((payment, index) => {
                                return <li key={index} className='my-4 flex gap-2 items-center'>
                                    <img width={40} src="/avatar.gif" alt="useravatar" />
                                    <span>{payment.name} donated <span className='font-bold'> ₹ {payment.amount}</span> with a message "{payment.message}"</span>
                                    </li>
                            })}

                        </ul>

                    </div>
                    <div className="makepayment w-full md:w-1/2 bg-slate-900 rounded-lg text-white px-2 md:p-10">
                        <h2 className='my-5 text-2xl font-bold'>Make a Payment</h2>
                        <div className='flex flex-col gap-2'>
                            {/* input for name and message */}
                            <div>
                                <input type="text" onChange={handleChange} value={paymentform.name} name="name" placeholder='Enter Name' className=' w-full p-3 rounded-lg bg-slate-800 text-white' /></div>
                            <input onChange={handleChange} value={paymentform.message} type="text" name="message" placeholder='Enter Message' className=' w-full p-3 rounded-lg bg-slate-800 text-white' />
                            <input onChange={handleChange} value={paymentform.amount} type="text" name="amount" placeholder='Enter Amount' className=' w-full p-3 rounded-lg bg-slate-800 text-white' />
                            <button onClick={() => pay(Number.parseInt(paymentform.amount) * 100)} type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none
               focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-purple-100" disabled={paymentform.name?.length < 3 || paymentform.message?.length < 4 || paymentform.amount?.length < 1}>Pay Now</button>
                    </div>

                    {/* Or choose from these amounts*/}

                    <div className="flex gap-2 mt-5">
                        <button className='bg-slate-800 p-3 rounded-lg' onClick={() => pay(1000)}>Pay ₹10</button>
                        <button className='bg-slate-800 p-3 rounded-lg' onClick={() => pay(2000)}>Pay ₹20</button>
                        <button className='bg-slate-800 p-3 rounded-lg' onClick={() => pay(3000)}>Pay ₹30</button>

                    </div>
                </div>
            </div>
        </div >




        </>
    )
}

export default PaymentPage
