import { z } from "zod";

export const ModifyReportSchema = z
	.object({
		weakness: z
			.string({
				required_error: "Weakness is required"
			}),
		comment: z
			.string({
				required_error: "Comment is required"
			})
	});

export type ModifyReportInput = z.infer<typeof ModifyReportSchema>;