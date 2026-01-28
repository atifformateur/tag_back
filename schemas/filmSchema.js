import { z } from 'zod';

// Validation Zod : on contrôle ce que le frontend a le droit d'envoyer.
export const createFilmSchema = z.object({
    title: z.string()
        .min(1, "Le titre est obligatoire")
        .max(255, "Le titre ne peut pas dépasser 255 caractères")
        .trim(),
    // Tags optionnels : si absent -> []
    // On limite aussi la longueur (dans la DB : tags.name est VARCHAR(100))
    tags: z.array(
        z.string()
            .min(1, "Un tag ne peut pas être vide")
            .max(100, "Un tag ne peut pas dépasser 100 caractères")
            .trim()
    )
        .optional()
        .default([])
});
