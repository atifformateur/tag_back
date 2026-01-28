import pool from '../config/database.js';

// Nettoie les tags (trim, lowercase) et enlève les doublons
export function normalizeTags(tags = []) {
  return [...new Set(
    tags
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0)
  )];
}

// Crée les tags qui n'existent pas encore et renvoie toutes les lignes (id + name)
export async function upsertTags(cleanTags, connection) {
  if (cleanTags.length === 0) {
    return [];
  }

  // on fabrique "(?), (?), (?)" selon le nombre de tags
  const placeholdersArray = [];
  for (let i = 0; i < cleanTags.length; i++) {
    placeholdersArray.push('(?)');
  }
  const values = placeholdersArray.join(', ');

  // Créer les tags manquants (les doublons sont ignorés grâce à INSERT IGNORE + UNIQUE(name))
  await connection.execute(
    `INSERT IGNORE INTO tags (name) VALUES ${values}`,
    cleanTags
  );

  // Récupérer les id de tous les tags concernés
  const tagPlaceholders = cleanTags.map(() => '?').join(', ');
  const [rows] = await connection.execute(
    `SELECT id, name FROM tags WHERE name IN (${tagPlaceholders})`,
    cleanTags
  );

  return rows; // [{ id, name }, ...]
}

