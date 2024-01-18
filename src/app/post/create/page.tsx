'use client'
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type Storage={
    'sessionID':string,
    'username':string,
    'roles':Array<string>
}

export default function CreatePost() {
    const router=useRouter();
    // Retrieve the session ID from localStorage
    const [storage,setStorage]=useState<Storage>(
        {
            'sessionID':"",
            'username':"",
            'roles':[]
        }
    );
    

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storageObjJSON: string | null = localStorage.getItem('sennit');
            if (storageObjJSON === null) {
                router.push('/');
            } else {
                const parsedObj: Storage = JSON.parse(storageObjJSON);
                setStorage(parsedObj);
                if (parsedObj.sessionID === "" || parsedObj.roles.length===0 || parsedObj.username === "") {
                    router.push('/');
                }
            }
        }
    }, []);

    const handleSubmit= async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formDataObj = Object.fromEntries(formData.entries());
        try{
            const response = await fetch('http://localhost:8080/api/posts/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Session-ID':storage.sessionID
                },
                body:JSON.stringify({
                    'title': formDataObj.title,
                    'content':formDataObj.content
                })
            });
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const responseData = await response.json();
            console.log(responseData);
            router.push('/home');
        }catch(error){
            console.error('Error sending data to the API', error);
        }
    }

    const handleClickBack=(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        router.push('/home');
    }

    return (
      <main className="min-h-screen bg-black">
        <Header username={storage.username}/>
        <form onSubmit={handleSubmit} className="w-[682px] mx-auto mt-[100px]">
            <button onClick={handleClickBack} className="bg-white px-3 py-1 mb-2 rounded-lg">Back</button>
            <div className="bg-[#1a1a1b] rounded-3xl p-5">
                <h2 className="text-white font-bold text-xl pb-4">Create post</h2>
                <div className="pb-8">
                    <label htmlFor="title" className="text-[#b6b6b6] pb-3 block">Title</label>
                    <input type="text" id="title" name="title" required className="bg-[#1a1a1a] w-full rounded-lg text-white py-3 px-2 border border-gray-600"/>
                </div>
                <div>
                    <label htmlFor="content" className="text-[#b6b6b6] pb-3 block">Content</label>
                    <textarea id="content" name="content" rows={5} cols={33} required className="bg-[#1a1a1a] w-full h-[300px] rounded-lg text-white py-3 px-2 border border-gray-600"/>
                </div>
                <div className="w-full flex justify-end gap-4 pt-4">
                    <button type="submit" className="bg-white text-lg text-[#1a1a1b] rounded-lg px-4 hover:bg-[#00dc82] transition-colors">Create</button>
                </div>
            </div>
            </form>
      </main>
    )
  }
  