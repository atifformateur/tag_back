import pool from '../config/database.js';
import { normalizeTags, upsertTags } from './tagService.js';

// Service qui gère toute la logique "créer un film + ses tags"
export async function createFilmWithTags({ title, tags = [] }) {
  const connection = await pool.getConnection();

  try {
    //attend le commit de la transaction
    //point super important  
    await connection.beginTransaction();

    // 1) Nettoyer / dédupliquer les tags
    const cleanTags = normalizeTags(tags);

    // 2) Créer le film
    const [filmResult] = await connection.execute(
      'INSERT INTO films (title) VALUES (?)',
      [title]
    );
    const filmId = filmResult.insertId;

    let tagRows = [];

    // 3) Créer / récupérer les tags si besoin
    if (cleanTags.length > 0) {
      tagRows = await upsertTags(cleanTags, connection);

      // 4) Associer les tags au film
      if (tagRows.length > 0) {
        const filmTagValues = tagRows.map(() => '(?, ?)').join(', ');
        const params = tagRows.flatMap(tag => [filmId, tag.id]);

        await connection.execute(
          `INSERT IGNORE INTO film_tag (film_id, tag_id) VALUES ${filmTagValues}`,
          params
        );
      }
    }

    await connection.commit();

    // On renvoie un objet simple, que le controller transformera en JSON
    return {
      id: filmId,
      title,
      tags: cleanTags
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

