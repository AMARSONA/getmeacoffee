
import React from 'react'
import Dashboard from '@/components/Dashboard'
// import { useRouter, notFound } from 'next/navigation'
// import { useSession, signIn, signOut } from 'next-auth/react'

const DashboardPage = () => {
  // const { data: session } = useSession()
  // if (!session) {
  //   const router = useRouter()
  //   router.push('/login')
  // }
    return (
     <Dashboard/> 
    //  <div>
        
    //   </div>
    )
  }


  export default DashboardPage

// "use client"

// import Dashboard from '@/components/Dashboard'

// const DashboardPage = () => {
//     return (
//         <Dashboard />
//     )
// }

// export default DashboardPage

export const metadata = {
    title: "Dashboard - Get Me A Coffee",
  }





