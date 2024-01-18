'use client'
import Header from "@/components/Header";
import ListPosts from "@/components/ListPosts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Storage={
    'sessionID':string,
    'username':string,
    'roles':Array<string>
}

export default function Home() {
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

    return (
      <main className="min-h-screen bg-black">
        <Header username={storage.username}/>
        <ListPosts sessionID={storage.sessionID} username={storage.username} roles={storage.roles}/>
      </main>
    )
  }
  