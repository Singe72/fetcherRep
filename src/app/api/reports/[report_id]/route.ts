import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {IReport, ReportUpdateRequest} from "@/lib/types";

export async function GET(
    request: Request,
    { params }: { params: { report_id: string } }
) {
    const report_id = params.report_id;
    const report = await prisma.report.findUnique({
        where: {
            report_id,
        },
    });

    if (!report) {
        let error_response = {
            status: "fail",
            message: "The provided report is unknown",
        };
        return new NextResponse(JSON.stringify(error_response), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    let json_response = {
        status: "success",
        data: {
            report,
        },
    };
    return NextResponse.json(json_response);
}

export async function PATCH(
    request: Request,
    { params }: { params: { report_id: string } }
) {
    try {
        let json: ReportUpdateRequest = await request.json();

        await prisma.report_Vulnerability.deleteMany({
            where: {
                report_vulnerability_report_id: json.report.report_id
            }
        });

        const updated_report = await prisma.report.update({
            where: { report_id: json.report.report_id },
            data: {
                report_weakness: json.report.report_weakness,
                report_disclosure: json.report.report_disclosure,
                report_top_report: json.report.report_top_report,
                report_comment: json.report.report_comment,
                report_state: "processed"
            },
        });

        for(const vulnerability of json.vulnerability){
            if(vulnerability.__isNew__ == true){
                const _vulnerability = await prisma.vulnerability.create({
                    data: {
                        vulnerability_name: vulnerability.label,
                    }
                });

                await prisma.report_Vulnerability.create({
                    data: {
                        report_vulnerability_report_id: json.report.report_id,
                        report_vulnerability_vulnerability_id: _vulnerability.vulnerability_id
                    }
                });
            }
        }

        let json_response = {
            status: "success",
            data: {
                report: updated_report,
            },
        };
        return NextResponse.json(json_response);
    } catch (error: any) {
        if (error.code === "P2025") {
            let error_response = {
                status: "fail",
                message: "The provided report is unknown",
            };
            return new NextResponse(JSON.stringify(error_response), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        let error_response = {
            status: "error",
            message: error.message,
        };
        return new NextResponse(JSON.stringify(error_response), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}