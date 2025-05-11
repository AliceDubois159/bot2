// Configuration de l'API pour l'application hébergée sur GitHub Pages
const config = {
    // URL de l'API hébergée sur PythonAnywhere (à modifier avec votre username)
    apiUrl: 'https://Alicedb.pythonanywhere.com/api/data.json',
    
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