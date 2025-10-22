import { z } from "zod";

export const addSpecialities = z.object({
    title: z.string({
        error: "Title is required!"
    }),
    icon: z.string({
        error: "Icon is required"
    })
});

