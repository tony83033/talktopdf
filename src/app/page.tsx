import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ClerkProvider, UserButton ,auth} from '@clerk/nextjs'
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';
export default async function Home() {
  const {userId} = await auth();
  const isAuth = !!userId;
  return (
   <div className='w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100'>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1 ">
      <div className='fle flex-col items-center text-center'>
        <div className='flex item-center w-full'>
          <h1 className='  text-5xl text-center font-semibold mx-auto '>TALK TO PDF</h1>
          <UserButton afterSignOutUrl="/"></UserButton>
        </div>
        <div className="flex m-2 items-center w-full "> 
          {isAuth &&  <Button className='text-center mx-auto bg-black text-white'>GO TO CHATS</Button> }
         
        </div>
        <p className='max-w-full mt-2 text-center text-lg text-slate-600'>join milllion of sudents. resarchers and professinals to instantly answer question and understand research with AI</p>

        <div className='w-full mt-4'>
          {isAuth ?(<FileUpload></FileUpload>):(<Link href="/sign-in">
          <Button className='bg-black text-white' variant="outline"> Login to get Started <LogIn className='w-4 h-4 m-2'/></Button>

          </Link>)}
        </div>
      </div>
    </div>
    
   </div>

  )
}
