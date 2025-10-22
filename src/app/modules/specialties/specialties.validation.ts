import { z } from "zod";

export const addSpecialities = z.object({
    title: z.string({
        error: "Title is required!"
    })
});

