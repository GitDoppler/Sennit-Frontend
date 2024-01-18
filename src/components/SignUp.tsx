import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { motion } from "framer-motion"
import { useUserStore } from "@/app/store";
import { useRouter } from "next/navigation";
export default function SignUp({signup,setSignup}:{signup:boolean,setSignup:Dispatch<SetStateAction<boolean>>}){
    const router=useRouter();
    const updateUsername=useUserStore((state)=>state.updateUsername);
    const updateRoles=useUserStore((state)=>state.updateRoles);
    const handleSubmit= async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formDataObj = Object.fromEntries(formData.entries());
        try{
            const response = await fetch('http://localhost:8080/api/signup', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObj)
            });
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const responseData = await response.json();
            const storageObj={
                'sessionID':responseData.sessionID,
                'username':responseData.username,
                'roles':responseData.listRoles,
            }
            localStorage.setItem('sennit', JSON.stringify(storageObj));
            router.push('/home');
        }catch(error){
            console.error('Error sending data to the API', error);
        }
    }

    return(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-[#121212] flex flex-col gap-12">
                <div>
                    <h2 className=" text-2xl font-bold text-white pb-4">Sign Up</h2>
                    <p className="text-[#B6B6B6]">Welcome ! <button onClick={()=>setSignup(!signup)} className="text-[#00DC82]">Already have an account ?</button></p>
                </div>
                <div className="flex flex-col gap-8">
                    <div>
                        <label htmlFor="username" className="text-[#b6b6b6] pb-3 block">Username</label>
                        <input type="text" id="username" name="username" required className="bg-[#1a1a1a] w-full rounded-lg text-white py-3 px-2"/>
                    </div>
                    <div>
                        <label htmlFor="email" className="text-[#b6b6b6] pb-3 block">Email</label>
                        <input type="email" id="email" name="email" pattern=".+@gmail\.com" required className="bg-[#1a1a1a] w-full rounded-lg text-white py-3 px-2"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="text-[#b6b6b6] pb-3 block">Password</label>
                        <input type="password" id="password" name="password" required className="bg-[#1a1a1a] w-full h-12 rounded-lg text-white py-3 px-2"/>
                    </div>
                </div>
                <button type="submit" className="group w-[416px] bg-black rounded-lg hover:bg-[#00DC82] transition-colors duration-500">
                    <div className="py-3 font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00DC82] to-[#02FF2B] group-hover:text-black transition-colors duration-500">Log In</div>   
                </button>
            </form>
        </motion.div>
    );
}