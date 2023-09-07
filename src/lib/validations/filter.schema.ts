import { z } from "zod";

export const FilterSchema = z
	.object({
		limit: z
			.number()
			.min(1,
				"Limit should be greater than 1")
			.max(200,
				"Limit should be lower than 200")
	});

export type FilterInput = z.infer<typeof FilterSchema>;