import Image from "next/image";
import { PiSpinner } from "react-icons/pi";

const LoadingPage = () => {
  return (
    <div className="w-full h-screen flex flex-col gap-2 items-center justify-center align-center">
      <Image src={'/logo.png'} alt={'logo'} width={32} height={32}/>
      <PiSpinner className="h-10 w-10 animate-spin text-[#865EFD]" />
    </div>
  );
};

export default LoadingPage;
