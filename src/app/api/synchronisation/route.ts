import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const sync = await prisma.synchronisation.findFirst({});

	let json_response = {
		is_synchronising: false,
	};

	if(sync){
		json_response.is_synchronising = sync.is_synchronising
	}
	
	return NextResponse.json(json_response);
}
