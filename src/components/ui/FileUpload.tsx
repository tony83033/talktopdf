"use client"
import { uploadToS3 } from '@/lib/db/s3';
import { Inbox, Loader } from 'lucide-react';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone'
import { useMutation } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
//type Props = {}

const FileUpload = () => {
    const [uploading,setUploading] = useState(false);
    const {mutate,isLoading} = useMutation({
        mutationFn: async({
            file_key,file_name
        }: {
            file_key: string; file_name: string})=>{
            const response = await axios.post('/api/create-chat',{
                file_key,
                file_name,
            });
            return response.data;
        }
    });
    const {getRootProps,getInputProps} = useDropzone({
        accept: {'application/pdf': ['.pdf']},
        maxFiles:1,
        onDrop: async (acceptedFile)=>{
            console.log(acceptedFile);
            const file = acceptedFile[0];
            if(file.size > 10 * 1024 *1024){
                // IF PDF FILE IS BIGGER THAN 10MB;
                toast.error("File is too large to upload");
              //  alert('Please upload a smaller file');
                return;
            }
            try {
                setUploading(true);
                const data = await uploadToS3(file); // Uploading file to s3
                // After Uploading File to s3 
                // Now Upload pdf to Database
                // We have file_name & file_key
                if(!data?.file_key || !data.file_name){
                    toast.error("Something went Wrong");
                    //alert("something went wrong");
                    return;
                }
                // mutate function is form react-query
                mutate(data,{
                    onSuccess: (data)=>{
                        console.log("Success fully store pdf in database",data);
                        toast.success(data.message);
                    },
                    onError:(err)=>{
                        console.log("Error in storing pdf in database",err);
                        toast.error("Error Creating chat room");
                    }
                });
                console.log("success in upload pdf to s3",data);
            } catch (error) {
                console.log("Error in s3 upload",error);
                
            }finally{
                setUploading(false);
            }

        }
    });
  return (
    <div className='p-2 bg-white rounded-xl'>
        <div {...getRootProps({
                className: 'border-dashed border-2 rounded-xl cursor-pointer  bg-gray-50 py-8 flex justify-center items-center flex-col'
            })}>
            <input {...getInputProps()} />
            {(uploading || isLoading)?(
                <>
                {/* Loading State */}
                <Loader className='h-10 w-10 text-blue-600 animate-spin'></Loader>
                <p className='mt-2 text-sm text-slate-500'>
                    Spilling Tea to GPT..
                </p>
                </>
            ):(
                  <>

                  <Inbox className='w-10 h-10 text-blue-500'/>
                  <p className='mt-2 text-sm text-slate-500'>Drop PDF Here</p>
                  </>
            ) }
          
        </div>
    </div>
  )
}

export default FileUpload