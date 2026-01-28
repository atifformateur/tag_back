import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import filmRoutes from './routes/filmRoutes.js';
import { testConnection } from './config/database.js';

// Charge les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permet les requêtes depuis le frontend
app.use(express.json()); // Parse le JSON des requêtes

// Routes
app.use('/api/films', filmRoutes);

// Route de test
app.get('/', (req, res) => {
    res.json({
        message: 'API de gestion de films avec tags',
        endpoints: {
            'tester la route': 'POST /api/films'
        }
    });
});

// Démarrer le serveur
app.listen(PORT, async () => {
    console.log(`Serveur sur le port ${PORT}`);
    
    // Tester la connexion à la base de données
    await testConnection();
});

export default app;
