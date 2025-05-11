// Configuration de l'API pour l'application hébergée sur GitHub Pages
const config = {
    // URL du fichier de données JSON (stocké localement)
    apiUrl: './data/data.json',
    
    // Intervalle d'actualisation des données (en millisecondes)
    refreshInterval: 60000, // 60 secondes
    
    // Version de l'application
    version: '1.0.0'
};

// Ne pas modifier ci-dessous
if (typeof module !== 'undefined') {
    module.exports = config;
} else {
    window.apiConfig = config;
} 