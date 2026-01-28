import { createFilmWithTags } from '../services/filmService.js';

/**
 * Controller très fin :
 * - récupère les données du body
 * - appelle le service
 * - gère la réponse HTTP
 */
export async function createFilm(req, res) {
  try {
    const { title, tags = [] } = req.body;

    const film = await createFilmWithTags({ title, tags });

    res.status(201).json({
      success: true,
      message: 'Film créé avec succès',
      data: film
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
}
