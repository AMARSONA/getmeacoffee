
import React from 'react'
import PaymentPage from '@/components/PaymentPage'
import { notFound } from "next/navigation"
import connectDB from '@/db/connectDB'
import User from '@/models/User'



const Username = async ({ params }) => {

  // await params.username
  const username = params.username;

  await connectDB();

  const user = await User.findOne({ username });

  if (!user) {
    notFound(); // This stops rendering and shows the 404 page
  }

  // // If the username is not present in the database, show a 404 page
  // const checkUser = async () => {
  //   await connectDB();
  //   let u = await User.findOne({ username: params.username })
    

  //   if (!u) {
  //     return notFound()
  //   }
  // }
  // await checkUser()
  
  return (
      <>
        <PaymentPage username={username} />
      </>
    )

  // const Username = ({ params }) => {
    
  // }
}

export default Username

export async function generateMetadata({ params }) {
  return {
    title: `Support ${params.username} - Get Me A Coffee`,
  }
}
