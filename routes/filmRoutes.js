import express from 'express';
//route pour créer un film avec ses tags
import { createFilm } from '../controllers/filmController.js';
// middleware qui permet de valider des données d'entrée avec zod sur un "shéma de validation"
import { validate } from '../middleware/validation.js';
//schema de validation en question pour créer un film avec ses tags
import { createFilmSchema } from '../schemas/filmSchema.js';

const router = express.Router();

// Route pour créer un film avec ses tags
// POST /api/films
router.post('/', validate(createFilmSchema), createFilm);

export default router;
