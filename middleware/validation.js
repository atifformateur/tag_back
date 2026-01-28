/**
 * Middleware de validation avec Zod
 * Valide les données de la requête selon le schéma fourni
 */
export function validate(schema) {
    return (req, res, next) => {
        try {
            // Valider les données avec Zod
            const validatedData = schema.parse(req.body);
            
            // Remplacer req.body par les données validées (nettoyées)
            req.body = validatedData;
            
            // Passer au middleware suivant
            next();
        } catch (error) {
            // Si c'est une erreur de validation Zod
            if (error.errors) {
                return res.status(400).json({
                    success: false,
                    message: 'Erreur de validation',
                    errors: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            
            // Autre type d'erreur
            res.status(400).json({
                success: false,
                message: 'Erreur de validation',
                error: error.message
            });
        }
    };
}
