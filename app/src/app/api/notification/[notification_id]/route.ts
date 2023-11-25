import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {getErrorResponse} from "@/lib/helpers";

export async function PATCH(
	request: Request,
	{ params }: { params: { notification_id: number } }
) {
	const userId = request.headers.get("X-USER-ID");

	if (!userId) {
		return getErrorResponse(
			401,
			"You are not logged in, please provide token to gain access"
		);
	}

	try {

		const notification = await prisma.user_Notification.updateMany({
			where: {
				user_notification_user_id: Number(userId),
				user_notification_notification_id: Number(params.notification_id)
			},
			data: {
				user_notification_read: true
			}
		});

		let json_response = {
			status: "success",
			data: {
				report: notification,
			},
		};
		return NextResponse.json(json_response);
	} catch (error: any) {
		if (error.code === "P2025") {
			let error_response = {
				status: "fail",
				message: "The provided notification is unknown",
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