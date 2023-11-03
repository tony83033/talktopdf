import {Pinecone} from "@pinecone-database/pinecone"
import { downloadFromS3 } from "./s3-server";
import {PDFLoader} from 'langchain/document_loaders/fs/pdf';
import {Document, RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter'
let pinecone : Pinecone | null = null;

export const getPineconeClient = async()=>{
    if(!pinecone){ // if not connected with pinecone DB 
        // Inside if connect with pinecone DB
        pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
            environment: process.env.PINECONE_ENVIRONMENT!
        });
        
    }
    return pinecone;
}

type PDFPage = {
    pageContent: string;
    metadata: [
        loc: {pageNumber:number}
    ]
}

export async function loadS3IntoPinecone(filekey:string){
    // (1) obtain the pdf from s3 -> download and read from pdf
    console.log("downloading3 into file system"); 
    const file_name = await downloadFromS3(filekey); // it will return pdf file path like /tmp/pdf.Date.now....
    if(!file_name){
        throw new Error("Could not download pdf form s3");
    }
    const loader = new PDFLoader(file_name); // langchain function
    const pages =  (await loader.load()) as PDFPage[]; // it will return all the pages of pdf

    // (2) split pages of pdf into small segment
    async function prepareDocument(page: PDFPage){
        let {pageContent,metadata} = page;
        pageContent = pageContent.replace('/\n/g',''); // replace all the newline char with empty string
    }
    return pages;

}