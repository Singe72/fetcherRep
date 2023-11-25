import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {getErrorResponse} from "@/lib/helpers";

export async function GET(request: NextRequest) {
	const userId = request.headers.get("X-USER-ID");

	if (!userId) {
		return getErrorResponse(
			401,
			"You are not logged in, please provide token to gain access"
		);
	}

	const notifications = await prisma.notification.findMany({
		where: {
			notification_users: {
				some: {
					user_notification_user_id: Number(userId),
					user_notification_read: false
				}
			},
		}
	});

	let json_response = {
		status: "success",
		results: notifications.length,
		notifications: notifications,
	};

	return NextResponse.json(json_response);
}
