'use client'
import { useState } from "react";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import { motion, AnimatePresence } from "framer-motion"

export default function AuthForm(){
    const [signup,setSignup]=useState(false);
    return(
        <AnimatePresence>
            {signup?<SignUp signup={signup} setSignup={setSignup}/>:<LogIn signup={signup} setSignup={setSignup}/>}
        </AnimatePresence>
    );
}