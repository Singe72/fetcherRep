import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	let query;

	function numberWithSpaces(x: number) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}

	query = await prisma.report.aggregate({
		_count: {
			report_id: true
		}
	});

	const nbReport = numberWithSpaces(query._count.report_id);

	query = await prisma.report.aggregate({
		_count: {
			report_id: true
		},
		where: {
			report_state: "new"
		}
	});

	const nbNewReport = numberWithSpaces(query._count.report_id);

	query = await prisma.report.findMany({
		distinct: ['report_program'],
		select: {
			report_program: true,
		},
	});

	const nbPrograms = numberWithSpaces(query.length);

	query = await prisma.report.findMany({
		select: {
			report_reward: true,
		},
		orderBy: {
			report_reward: "desc"
		},
		take: 1
	});


	const maxReward = (query.length == 0 || query[0].report_reward! == null) ? 0 : numberWithSpaces(query[0].report_reward!);

	return NextResponse.json({
		statistics : {
			nb_report: nbReport,
			nb_new_report: nbNewReport,
			nb_programs: nbPrograms,
			max_reward: maxReward
		}
	});
}
