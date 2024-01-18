import Image from "next/image";
import Logo from "@/assets/LogoSVG.svg";
import AuthForm from "@/components/AuthForm";
export default function Auth() {
  return (
    <main className="flex min-h-screen bg-black">
      <div className="w-[32%] flex flex-col justify-between">
        <Image src={Logo} alt="Sennit logo"/>
        <div className="pl-9">
          <h1 className="font-bold text-[64px] pb-5 text-transparent bg-clip-text bg-gradient-to-r from-[#00DC82] to-[#02FF2B]">Sennit</h1>
          <p className="font-bold text-2xl text-white max-w-[240px]">Where every story has been seen</p>
        </div>
        <div className="w-full h-12 bg-white bg-gradient-to-r from-[#00DC82] to-[#02FF2B]"></div>
      </div>
      <div className="flex-grow bg-[#1A1A1A] flex items-center justify-center">
        <AuthForm/>
      </div>
    </main>
  )
}
