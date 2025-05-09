/**
 * Script principal pour la mini-application Telegram
 */

// Initialiser l'intégration avec Telegram
let tg = window.Telegram.WebApp;

// URL de l'API pour charger les données
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? `${window.location.protocol}//${window.location.host}/api/data.json` 
  : `${window.location.origin}/api/data.json`;

// Données de secours en cas d'échec de chargement depuis l'API
let fallbackData = null;
if (window.appData) {
  fallbackData = window.appData;
}

// État de l'application
let categories = [];
let provenances = [];
let plantes = [];
let filtreCategorie = "Toutes les catégories";
let filtreProvenance = "Toutes les provenances";
let isLoading = true;

// Éléments DOM
const plantsContainer = document.getElementById('plants-container');
const categoriesFilter = document.getElementById('categories-filter');
const provenanceFilter = document.getElementById('provenance-filter');
const categoriesPopup = document.getElementById('categories-popup');
const provenancePopup = document.getElementById('provenance-popup');
const categoriesList = document.getElementById('categories-list');
const provenanceList = document.getElementById('provenance-list');
const overlay = document.getElementById('overlay');

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', async () => {
    // Configurer l'intégration Telegram
    tg.expand();
    tg.MainButton.setText('Contacter');
    tg.MainButton.hide();

    // Appliquer les couleurs de Telegram si disponibles
    applyTelegramTheme();

    // Configurer les écouteurs d'événements
    setupEventListeners();

    // Charger les données depuis l'API
    await loadData();

    // Remplir les listes de filtres
    populateFilterLists();

    // Afficher les plantes
    renderPlants();
});

/**
 * Charge les données depuis l'API
 */
async function loadData() {
    showLoadingIndicator();
    
    try {
        console.log("Chargement des données depuis:", API_URL);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Mise à jour des données de l'application
        categories = data.categories || [];
        provenances = data.provenances || [];
        plantes = data.plantes || [];
        
        console.log("Données chargées avec succès:", {
            categories: categories.length,
            provenances: provenances.length,
            plantes: plantes.length
        });
        
        hideLoadingIndicator();
        return true;
    } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        
        // Utiliser les données de secours en cas d'erreur
        if (fallbackData) {
            console.log("Utilisation des données de secours");
            categories = fallbackData.categories || [];
            provenances = fallbackData.provenances || [];
            plantes = fallbackData.plantes || [];
        }
        
        hideLoadingIndicator();
        return false;
    }
}

/**
 * Affiche un indicateur de chargement
 */
function showLoadingIndicator() {
    isLoading = true;
    
    // Créer un élément de chargement s'il n'existe pas déjà
    if (!document.getElementById('loading-indicator')) {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="spinner"></div>
            <p>Chargement en cours...</p>
        `;
        loadingIndicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: white;
        `;
        
        const spinner = document.createElement('style');
        spinner.textContent = `
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 1s ease-in-out infinite;
                margin-bottom: 20px;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(spinner);
        document.body.appendChild(loadingIndicator);
    } else {
        document.getElementById('loading-indicator').style.display = 'flex';
    }
}

/**
 * Cache l'indicateur de chargement
 */
function hideLoadingIndicator() {
    isLoading = false;
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

/**
 * Configure les écouteurs d'événements pour l'interface
 */
function setupEventListeners() {
    // Écouteurs pour les boutons de filtre
    categoriesFilter.addEventListener('click', () => {
        togglePopup(categoriesPopup);
    });

    provenanceFilter.addEventListener('click', () => {
        togglePopup(provenancePopup);
    });

    // Écouteurs pour fermer les popups
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeAllPopups);
    });

    overlay.addEventListener('click', closeAllPopups);

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Gestion des erreurs globales
    window.addEventListener('error', (event) => {
        console.error('Erreur détectée:', event.error);
        tg.showAlert('Une erreur est survenue. Veuillez réessayer.');
    });
}

/**
 * Remplit les listes de filtres avec les options disponibles
 */
function populateFilterLists() {
    // Vider les listes existantes
    categoriesList.innerHTML = '';
    provenanceList.innerHTML = '';
    
    // Remplir la liste des catégories
    categories.forEach(categorie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="filter-option">
                <input type="radio" name="categorie" id="cat-${categorie}" value="${categorie}" 
                       ${categorie === filtreCategorie ? 'checked' : ''}>
                <label for="cat-${categorie}">${categorie}</label>
            </div>
        `;
        li.addEventListener('click', () => {
            filtreCategorie = categorie;
            categoriesFilter.textContent = categorie;
            closeAllPopups();
            renderPlants();
        });
        categoriesList.appendChild(li);
    });

    // Remplir la liste des provenances
    provenances.forEach(provenance => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="filter-option">
                <input type="radio" name="provenance" id="prov-${provenance}" value="${provenance}" 
                       ${provenance === filtreProvenance ? 'checked' : ''}>
                <label for="prov-${provenance}">${provenance}</label>
            </div>
        `;
        li.addEventListener('click', () => {
            filtreProvenance = provenance;
            provenanceFilter.textContent = provenance;
            closeAllPopups();
            renderPlants();
        });
        provenanceList.appendChild(li);
    });
}

/**
 * Affiche ou masque une popup de filtre
 */
function togglePopup(popup) {
    closeAllPopups();
    popup.classList.add('show');
    overlay.classList.add('show');
}

/**
 * Ferme toutes les popups ouvertes
 */
function closeAllPopups() {
    document.querySelectorAll('.filter-popup').forEach(popup => {
        popup.classList.remove('show');
    });
    overlay.classList.remove('show');
}

/**
 * Filtre et affiche les plantes selon les critères sélectionnés
 */
function renderPlants() {
    // Afficher un indicateur de chargement si nécessaire
    if (isLoading) {
        plantsContainer.innerHTML = '<div class="loading">Chargement en cours...</div>';
        return;
    }
    
    // Vider le conteneur
    plantsContainer.innerHTML = '';
    
    // Filtrer les plantes
    let plantesFiltrees = plantes;
    
    if (filtreCategorie !== "Toutes les catégories") {
        plantesFiltrees = plantesFiltrees.filter(plante => plante.categorie === filtreCategorie);
    }
    
    if (filtreProvenance !== "Toutes les provenances") {
        plantesFiltrees = plantesFiltrees.filter(plante => plante.provenance === filtreProvenance);
    }
    
    // Créer les cartes de plantes
    plantesFiltrees.forEach((plante, index) => {
        const template = document.getElementById('plant-card-template');
        const clone = document.importNode(template.content, true);
        
        // Utiliser l'image de la plante ou une image de substitution
        const imgElement = clone.querySelector('.card-image img');
        if (plante.image) {
            imgElement.src = plante.image;
        } else {
            // Utiliser une image de substitution
            const placeholderIndex = index % (window.appData?.placeholderImages?.length || 4);
            const placeholderSrc = window.appData?.placeholderImages?.[placeholderIndex] || './img/placeholder1.jpg';
            imgElement.src = placeholderSrc;
        }
        imgElement.alt = plante.nom;
        
        clone.querySelector('.plant-name').textContent = plante.nom;
        clone.querySelector('.plant-type').textContent = plante.type;
        
        // Ajouter l'événement de clic sur la carte
        const card = clone.querySelector('.plant-card');
        card.addEventListener('click', () => {
            showPlantDetails(plante);
        });
        
        plantsContainer.appendChild(clone);
    });
    
    // Afficher un message si aucune plante ne correspond
    if (plantesFiltrees.length === 0) {
        plantsContainer.innerHTML = '<div class="no-results">Aucune plante ne correspond à ces critères</div>';
    }
}

/**
 * Affiche les détails d'une plante lorsqu'on clique dessus
 */
function showPlantDetails(plante) {
    // Dans une implémentation réelle, on afficherait une popup détaillée
    // ou on naviguerait vers une nouvelle page
    const message = `
        ${plante.nom} (${plante.categorie} de ${plante.provenance})
        
        ${plante.description}
        
        Prix: 
        - À l'unité: ${plante.prix.unite}
        - Par 3: ${plante.prix.par_3}
        - Par 5: ${plante.prix.par_5}
        
        ${plante.videos?.length || 0} vidéo(s) disponible(s)
    `;
    
    tg.showAlert(message);
    
    // Afficher le bouton principal pour contacter
    tg.MainButton.setText('Contacter pour cette plante');
    tg.MainButton.show();
    
    // Définir l'action du bouton principal
    tg.MainButton.onClick(() => {
        // Envoyer les données au bot (dans une implémentation réelle)
        tg.sendData(JSON.stringify({
            action: 'contact',
            planteId: plante.id
        }));
    });
}

/**
 * Applique les couleurs du thème Telegram si disponibles
 */
function applyTelegramTheme() {
    if (tg.themeParams) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
        document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
        document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
        document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
        document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color);
    }
} 