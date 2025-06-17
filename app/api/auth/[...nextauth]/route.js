import NextAuth from 'next-auth';
// import AppleProvider from 'next-auth/providers/apple'
// import FacebookProvider from 'next-auth/providers/facebook'
// import GoogleProvider from 'next-auth/providers/google'
// import EmailProvider from 'next-auth/providers/email'
import GitHubProvider from "next-auth/providers/github";
import mongoose from "mongoose";
import User from '@/models/User';
import Payment from '@/models/Payment';
import connectDB from '@/db/connectDB';


export const authoptions = NextAuth({
    providers: [
        // OAuth authentication providers...

        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),

        // AppleProvider({
        //         clientId: process.env.APPLE_ID,
        //         clientSecret: process.env.APPLE_SECRET
        //     }),
        //     FacebookProvider({
        //         clientId: process.env.FACEBOOK_ID,
        //         clientSecret: process.env.FACEBOOK_SECRET
        //     }),
        //     GoogleProvider({
        //         clientId: process.env.GOOGLE_ID,
        //         clientSecret: process.env.GOOGLE_SECRET
        //     }),
        //     // Passwordless / email sign in
        //     EmailProvider({
        //         server: process.env.MAIL_SERVER,
        //         from: 'NextAuth.js <no-reply@example.com>'
        //     }),
    ],

    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // const isAllowedToSignIn = true
            if (account.provider == "github") {

                await connectDB(); // Ensure database connection is established
                
                //Check if user exists in database
                const currentUser = await User.findOne({ email:email })
                console.log(currentUser)
                
                if (!currentUser) {
                    // If user does not exist, create a new user
                    const newUser = await User.create({
                        // name: user.name,
                        email: user.email,
                        username: user.email.split('@')[0], // Use email prefix as username

                    })
                    // Create a payment record for the new user
                    
                    // user.name = newUser.username
                    // console.log(newUser)
                }
                // else {
                //     // If user exists, update the user information
                //     user.name = currentUser.username;
                // }
                return true
            }
        },

        async session({ session, user, token }) {
            const dbUser= await User.findOne({ email: session.user.email });
            // console.log(dbUser);
            session.user.name= dbUser.username 
            return session
        },
    }

})

export { authoptions as GET, authoptions as POST }