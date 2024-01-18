import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Post = {
    postID: number,
    postTitle: string,
    postContent: string,
    writerName: string,
    postScore: number,
    currentVote: number,
};

async function getListPosts(sessionID: string): Promise<Post[] | null> {
    if (sessionID === "") {
        return null;
    }
    const response = await fetch("http://localhost:8080/api/posts/top", {
        method: 'GET',
        headers: {
            'X-Session-ID': sessionID
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    const listPosts = responseData.listPosts;
    const goodList: Post[] = [];

    for (let i = 0; i < listPosts.length; i++) {
        const newPost: Post = {
            postID: listPosts[i].postID,
            postTitle: listPosts[i].postTitle,
            postContent: listPosts[i].postContent,
            writerName: listPosts[i].writerUsername,
            postScore: listPosts[i].postScore,
            currentVote: listPosts[i].currentVote
        };
        goodList.push(newPost); 
    }
    
    console.log(goodList);
    return goodList;
}

export default function ListPosts({ sessionID,username,roles }: { sessionID: string,username:string,roles:string[] }) {
    const [posts, setPosts] = useState<Post[]>([]);
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            try{
                const responseData = await getListPosts(sessionID);
                if (responseData) {
                    setPosts(responseData);
                }
            }catch(e){
                router.push('/');
            }
        };

        fetchData();
    }, [sessionID]);

    const handleClick=(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
    }

    return (
        <div className="w-[682px] mx-auto py-10 flex flex-col gap-8">
            {posts.map(post => (
                <Link href={'/post/'+post.postID} key={post.postID} className="w-full bg-[#1a1a1b] rounded-2xl flex border border-black hover:border-[#00dc82] transition-all">
                    <div className=" w-12 bg-[#161617] rounded-l-2xl flex flex-col items-center py-4 gap-2">
                        <button><ArrowUp color="#b6b6b6" size={24}/></button>
                        <button><div className="text-white">{post.postScore}</div></button>
                        <button><ArrowDown color="#b6b6b6" size={24}/></button>
                    </div>
                    <div className="flex-grow">
                        <div className="border-b border-[#373737] w-full p-2 flex justify-between">
                            <div className="text-white">
                                {"Posted by u/"+post.writerName}
                            </div>
                        </div>
                        <div className="p-5">
                            <h2 className="text-white font-bold text-lg pb-2">{post.postTitle}</h2>
                            <p className="text-white">{post.postContent}</p>
                        </div>

                    </div>
                </Link>
            ))}
        </div>
    );
}
