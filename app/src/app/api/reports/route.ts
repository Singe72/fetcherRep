import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const page_str = request.nextUrl.searchParams.get("page");
    const limit_str = request.nextUrl.searchParams.get("limit");
    const name_str = request.nextUrl.searchParams.get("name");
    const stateValue_str = JSON.parse(request.nextUrl.searchParams.get("stateValues")!.toString());
    const severityValue_str = JSON.parse(request.nextUrl.searchParams.get("severityValues")!.toString());

    if(stateValue_str.length == 0){
        stateValue_str.push("new");
    }

    if(severityValue_str.length == 0){
        severityValue_str.push("none");
        severityValue_str.push("low");
        severityValue_str.push("medium");
        severityValue_str.push("critical");
        severityValue_str.push("high");
    }


    const page = page_str ? parseInt(page_str, 10) : 1;
    const limit = limit_str ? parseInt(limit_str, 10) : 10;
    const skip = (page - 1) * limit;

    const reports = await prisma.report.findMany({
        take: limit,
        skip: skip,
        where: {
            report_state: {
                in: stateValue_str
            },
            report_severity: {
                in: severityValue_str
            },
            report_title: {
                contains: name_str!
            }
        },
        orderBy: [
            {
                report_state: "desc"
            }
        ]
    });

    const count = await prisma.report.aggregate({
        _count: {
            report_id: true
        },
        where: {
            report_state: {
                in: stateValue_str
            },
            report_severity: {
                in: severityValue_str
            },
            report_title: {
                contains: name_str!
            }
        }
    });



    let json_response = {
        status: "success",
        results: count._count.report_id,
        reports,
    };

    return NextResponse.json(json_response);
}
