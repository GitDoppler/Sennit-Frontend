import { ChevronDown, MessageCircleMore, Plus, Search } from 'lucide-react';
import Link from "next/link";
export default function Header({username}:{username:string}){
    return(
        <div className="w-[1120px] h-[64px] mx-auto px-5 bg-[#121212] bg-opacity-90 backdrop-blur-sm rounded-b-2xl flex items-center">
            <div className="font-bold text-xl text-transparent bg-gradient-to-r from-[#00DC82] to-[#02FF2B] bg-clip-text pr-[180px]">Sennit</div>
            <div className=" h-9 rounded-2xl w-[560px] px-4 flex gap-4 bg-[#1a1a1a] items-center">
                <Search color='#b6b6b6' size={16}/>
                <input type="text" placeholder="Search Sennit" className="text-[#b6b6b6] flex-grow bg-[#1a1a1a]"/>
            </div>
            <div className="flex items-center ml-auto gap-4">
                <Link href='/home'>
                    <MessageCircleMore color='#d7dadc' size={24}/>
                </Link>
                <Link href='/post/create'>
                    <Plus color='#d7dadc' size={24}/>
                </Link>
                <button className="w-[161px] flex justify-between">
                    <div className="font-bold text-[#00dc82]">{'u/'+username}</div>
                    <ChevronDown color='#d7dadc' size={24}/>
                </button>
            </div>
        </div>
    );   
}