import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const reports = await prisma.report.findMany({include: {report_vulnerabilities: {include: {vulnerability: true}}}});

    let json_response = {
        status: "success",
        results: reports.length,
        reports,
    };

    return NextResponse.json(json_response);
}
