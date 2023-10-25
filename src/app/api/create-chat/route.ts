import { NextResponse } from "next/server";

// api/create-chat
export async function POST(req: Request, res: Response){
    try{
        const body = await req.json();
        const {file_key,file_name} = body;
        console.log(file_key,file_name);

    }catch(error)
{
    console.error(error);
    return NextResponse.json(
        {error: "Internal Server Error"},
        {status: 500}
    );
}

}