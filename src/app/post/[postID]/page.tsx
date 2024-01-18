'use client'
import Header from "@/components/Header";
import ListPosts from "@/components/ListPosts";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion"

type Storage={
    'sessionID':string,
    'username':string,
    'roles':Array<string>
}

type Post = {
    postID: number,
    postTitle: string,
    postContent: string,
    writerName: string,
    postScore: number,
    currentVote: number,
};


async function getPost(postID:string,sessionID:string){
        const response=await fetch("http://localhost:8080/api/posts/find/"+postID,{
            "method":"GET",
            headers: {
                'X-Session-ID': sessionID
            }
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData =await response.json();
        const newPost: Post = {
            postID: responseData.postID,
            postTitle: responseData.postTitle,
            postContent: responseData.postContent,
            writerName: responseData.writerName,
            postScore: responseData.postScore,
            currentVote: responseData.currentUserVote
        };
        return newPost;
}

export default function Page({ params }: { params: { postID: string } }) {
    const router=useRouter();
    // Retrieve the session ID from localStorage
    const [storage,setStorage]=useState<Storage>(
        {
            'sessionID':"",
            'username':"",
            'roles':[]
        }
    );
    const [edit,setEdit]=useState(false);
    const defaultPost: Post = {
        postID: 0,
        postTitle: "Loading...",
        postContent: "Please wait while the post is being loaded.",
        writerName: "Loading",
        postScore: 0,
        currentVote: 0,
    };
    const [post,setPost]=useState<Post>(defaultPost);

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
                const fetchData = async () => {
                    try{
                        const responseData = await getPost(params.postID,parsedObj.sessionID);;
                        if (responseData) {
                            setPost(responseData);
                        }
                    }catch(e){
                        router.push('/');
                    }

                };
                fetchData();
            }
        }
    }, []);

    const handleClick=(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        setEdit(true);
    }

    const handleClickBack=(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        router.push('/home');
    }

    const handleSubmit= async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formDataObj = Object.fromEntries(formData.entries());
        try{
            const response = await fetch('http://localhost:8080/api/posts/edit', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Session-ID':storage.sessionID
                },
                body:JSON.stringify({
                    'postID': post.postID,
                    'title': formDataObj.title,
                    'content':formDataObj.content
                })
            });
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const responseData = await response.json();
            console.log(responseData);
            location.reload();
        }catch(error){
            console.error('Error sending data to the API', error);
        }
    }

    const handleDelete= async (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:8080/api/posts/delete', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Session-ID':storage.sessionID
                },
                body:JSON.stringify({
                    'postID': post.postID,
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

    return (
      <main className="min-h-screen bg-black">
        <Header username={storage.username}/>
        {!edit?
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-[800px] mx-auto mt-[200px] drop-shadow-[0px_35px_35px_rgba(0,220,130,0.35)] ">
        <button onClick={handleClickBack} className="bg-white px-3 py-1 mb-2 rounded-lg">Back</button>
            <div key={post.postID} className="w-full bg-[#1a1a1b] rounded-3xl flex border border-[#00dc82]">
                    <div className=" w-14 bg-[#161617] rounded-l-3xl flex flex-col items-center py-6 gap-4">
                        <button><ArrowUp color="#b6b6b6" size={32}/></button>
                        <button><div className="text-white text-xl font-bold">{post.postScore}</div></button>
                        <button><ArrowDown color="#b6b6b6" size={32}/></button>
                    </div>
                    <div className="flex-grow">
                        <div className="border-b border-[#373737] w-full p-4 flex justify-between">
                            <div className="text-white text-lg">
                                {"Posted by u/"+post.writerName}
                            </div>
                            {storage.username===post.writerName||storage.roles.includes("ADMIN")?
                                <div className="flex gap-2">
                                <button onClick={handleClick} className="bg-white text-lg text-[#1a1a1b] rounded-lg px-4 hover:bg-[#00dc82] transition-colors">Edit</button>
                                <button onClick={handleDelete} className="bg-red-500 text-lg text-white rounded-lg px-4 hover:bg-white hover:border hover:border-red-500 hover:text-red-500 transition-all">Delete</button>
                                </div>
                            :null}
                        </div>
                        <div className="p-7">
                            <h2 className="text-white font-bold text-2xl pb-4">{post.postTitle}</h2>
                            <p className="text-white text-xl">{post.postContent}</p>
                        </div>

                    </div>
                </div>  
        </motion.div>
        :
            <form onSubmit={handleSubmit} className="w-[682px] mx-auto mt-[100px] bg-[#1a1a1b] rounded-3xl p-5">
                <h2 className="text-white font-bold text-xl pb-4">Edit post</h2>
                <div className="pb-8">
                    <label htmlFor="title" className="text-[#b6b6b6] pb-3 block">Title</label>
                    <input type="text" id="title" name="title" required className="bg-[#1a1a1a] w-full rounded-lg text-white py-3 px-2 border border-gray-600"/>
                </div>
                <div>
                    <label htmlFor="content" className="text-[#b6b6b6] pb-3 block">Content</label>
                    <textarea id="content" name="content" rows={5} cols={33} required className="bg-[#1a1a1a] w-full h-[300px] rounded-lg text-white py-3 px-2 border border-gray-600"/>
                </div>
                <div className="w-full flex justify-end gap-4 pt-4">
                    <button type="button" onClick={()=>setEdit(false)} className="bg-white text-lg text-[#1a1a1b] rounded-lg px-4 hover:bg-[#00dc82] transition-colors">Cancel</button>
                    <button type="submit" className="bg-white text-lg text-[#1a1a1b] rounded-lg px-4 hover:bg-[#00dc82] transition-colors">Save</button>
                </div>

            </form>
        }
      </main>
    )
  }
  