/**
 * Script principal pour la mini-application Telegram
 */

// Ajout de logs de débogage
console.log("Initialisation de l'application...");

// Injecter une fonction de détection directe de clic
window.addEventListener('click', function(event) {
    console.log('CLIC DIRECT DÉTECTÉ SUR:', event.target);
    
    // Vérifier si le clic est sur un bouton de filtre
    if (event.target.id === 'categories-filter' || event.target.id === 'provenance-filter') {
        console.log('CLIC SUR BOUTON DE FILTRE DÉTECTÉ PAR ÉCOUTEUR GLOBAL:', event.target.id);
        
        const debugMsg = document.getElementById('debug-message');
        if (debugMsg) {
            debugMsg.style.display = 'block';
            debugMsg.textContent = 'Clic sur ' + event.target.id + ' détecté!';
        }
        
        // Forcer l'ouverture de la popup correspondante
        if (event.target.id === 'categories-filter') {
            const popup = document.getElementById('categories-popup');
            if (popup) {
                console.log('Ouverture forcée de la popup catégories');
                closeAllPopups();
                popup.classList.add('show');
                document.getElementById('overlay').classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        } else if (event.target.id === 'provenance-filter') {
            const popup = document.getElementById('provenance-popup');
            if (popup) {
                console.log('Ouverture forcée de la popup provenances');
                closeAllPopups();
                popup.classList.add('show');
                document.getElementById('overlay').classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        }
    }
});

// Initialiser l'intégration avec Telegram
let tg = window.Telegram.WebApp;

// URL de l'API pour charger les données
const API_URL = '/bot2/data/data.json';
console.log("URL de l'API configurée:", API_URL);

// Données de secours en cas d'échec de chargement depuis l'API
let fallbackData = null;
if (window.appData) {
  fallbackData = window.appData;
  console.log("Données de secours disponibles");
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
const debugMsg = document.getElementById('debug-message');

// Log des éléments DOM pour débogage
console.log("Éléments DOM:", {
    plantsContainer: plantsContainer ? "OK" : "Non trouvé",
    categoriesFilter: categoriesFilter ? "OK" : "Non trouvé",
    provenanceFilter: provenanceFilter ? "OK" : "Non trouvé",
    categoriesPopup: categoriesPopup ? "OK" : "Non trouvé",
    provenancePopup: provenancePopup ? "OK" : "Non trouvé",
    categoriesList: categoriesList ? "OK" : "Non trouvé",
    provenanceList: provenanceList ? "OK" : "Non trouvé",
    overlay: overlay ? "OK" : "Non trouvé"
});

// Ajout de la fonction de débogage
function debug(message) {
    console.log(message);
    if (debugMsg) {
        debugMsg.style.display = 'block';
        debugMsg.textContent = message;
        // Masquer automatiquement après 5 secondes (augmenté)
        setTimeout(() => {
            debugMsg.style.display = 'none';
        }, 5000);
    }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    debug("Application initialisée, chargement en cours...");
    
    // Configurer l'intégration Telegram
    try {
        tg.expand();
        tg.MainButton.setText('Contacter');
        tg.MainButton.hide();
        debug("Intégration Telegram configurée avec succès");
    } catch (e) {
        debug("Erreur lors de l'initialisation de Telegram: " + e.message);
    }

    // Appliquer les couleurs de Telegram si disponibles
    try {
        applyTelegramTheme();
        debug("Thème Telegram appliqué");
    } catch (e) {
        debug("Erreur lors de l'application du thème: " + e.message);
    }

    // Configurer les écouteurs d'événements tout de suite
    try {
        setupDirectEventListeners();
        debug("Écouteurs d'événements directs configurés");
    } catch (e) {
        debug("Erreur lors de la configuration des écouteurs directs: " + e.message);
    }

    // Charger les données depuis l'API
    loadData()
        .then(() => {
            debug("Données chargées avec succès");
            
            // Une fois les données chargées, remplir les listes et configurer les écouteurs complets
            try {
                populateFilterLists();
                debug("Listes de filtres remplies");
                
                setupEventListeners();
                debug("Tous les écouteurs d'événements configurés");
                
                renderPlants();
                debug("Plantes affichées avec succès");
            } catch (e) {
                debug("Erreur après chargement des données: " + e.message);
            }
        })
        .catch(e => {
            debug("Erreur lors du chargement des données: " + e.message);
        });
});

// Configuration des écouteurs d'événements directs (avant chargement des données)
function setupDirectEventListeners() {
    console.log("Configuration des écouteurs d'événements directs...");
    
    // Écouteurs pour les boutons de filtre
    if (categoriesFilter) {
        console.log("Ajout de l'écouteur pour categories-filter");
        categoriesFilter.onclick = function(e) {
            console.log("CLIC SUR LE BOUTON CATÉGORIES DÉTECTÉ");
            debug("Ouverture du menu catégories");
            e.preventDefault();
            e.stopPropagation();
            
            // Vérifier si les popups sont disponibles
            if (!categoriesPopup) {
                debug("ERREUR: Popup catégories non trouvée!");
                return;
            }
            
            togglePopup(categoriesPopup);
        };
    } else {
        console.error("Element categoriesFilter non trouvé!");
    }

    if (provenanceFilter) {
        console.log("Ajout de l'écouteur pour provenance-filter");
        provenanceFilter.onclick = function(e) {
            console.log("CLIC SUR LE BOUTON PROVENANCE DÉTECTÉ");
            debug("Ouverture du menu provenances");
            e.preventDefault();
            e.stopPropagation();
            
            // Vérifier si les popups sont disponibles
            if (!provenancePopup) {
                debug("ERREUR: Popup provenances non trouvée!");
                return;
            }
            
            togglePopup(provenancePopup);
        };
    } else {
        console.error("Element provenanceFilter non trouvé!");
    }

    // Écouteurs pour fermer les popups
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.onclick = function(e) {
            console.log("Clic sur le bouton fermer");
            e.preventDefault();
            e.stopPropagation();
            closeAllPopups();
        };
    });

    if (overlay) {
        overlay.onclick = function(e) {
            console.log("Clic sur l'overlay");
            e.preventDefault();
            e.stopPropagation();
            closeAllPopups();
        };
    }

    // Bouton de test pour vérifier si les popups s'affichent
    const testButton = document.getElementById('test-button');
    if (testButton) {
        testButton.onclick = function() {
            debug("Test des popups en cours...");
            console.log("Bouton de test cliqué");
            
            if (categoriesPopup) {
                debug("Affichage manuel de la popup catégories");
                togglePopup(categoriesPopup);
            } else {
                debug("ERREUR: Popup catégories non trouvée!");
            }
        };
    }
}

/**
 * Charge les données depuis l'API
 */
async function loadData() {
    console.log("Début du chargement des données...");
    showLoadingIndicator();
    
    try {
        console.log("Tentative de chargement depuis:", API_URL);
        const timestamp = new Date().getTime();
        const response = await fetch(`${API_URL}?t=${timestamp}`);
        
        if (!response.ok) {
            console.error(`Erreur HTTP: ${response.status}`);
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Données reçues:", data);
        
        // Vérifier si les données sont vides (problème Airtable)
        if (data.plantes && data.plantes.length > 0) {
            const plantesAvecChamps = data.plantes.filter(plante => 
                plante.nom && plante.nom !== "Sans nom" && 
                Object.keys(plante.fields || {}).length > 0);
            
            if (plantesAvecChamps.length === 0) {
                console.warn("ATTENTION: Les données Airtable semblent vides ou mal configurées!");
                debug("ERREUR: Données Airtable vides. Veuillez consulter le guide GUIDE_AIRTABLE.md");
                
                // Créer un message d'erreur visible
                const errorMsg = document.createElement('div');
                errorMsg.innerHTML = `
                    <div style="background-color: #ffebee; color: #c62828; padding: 20px; margin: 20px; border-radius: 5px; text-align: center;">
                        <h2>⚠️ Problème avec les données Airtable</h2>
                        <p>Les enregistrements Airtable existent mais ne contiennent aucune donnée.</p>
                        <p>Veuillez consulter le fichier <strong>GUIDE_AIRTABLE.md</strong> pour configurer correctement votre base Airtable.</p>
                    </div>
                `;
                if (plantsContainer) {
                    plantsContainer.innerHTML = '';
                    plantsContainer.appendChild(errorMsg);
                }
                
                // Utiliser les données de secours
                if (fallbackData) {
                    console.log("Utilisation des données de secours en raison de données Airtable vides");
                    categories = fallbackData.categories || [];
                    provenances = fallbackData.provenances || [];
                    plantes = fallbackData.plantes || [];
                    
                    // Créer un message indiquant l'utilisation des données de secours
                    const fallbackMsg = document.createElement('div');
                    fallbackMsg.innerHTML = `
                        <div style="background-color: #e8f5e9; color: #2e7d32; padding: 10px; margin: 10px; border-radius: 5px; text-align: center;">
                            <p>Affichage des données de démonstration</p>
                        </div>
                    `;
                    if (plantsContainer) {
                        plantsContainer.appendChild(fallbackMsg);
                    }
                }
                
                hideLoadingIndicator();
                return false;
            }
        }
        
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
 * Configure les écouteurs d'événements pour l'interface après chargement des données
 */
function setupEventListeners() {
    console.log("Configuration des écouteurs d'événements complets...");
    
    // Désactiver le défilement lorsqu'une popup est ouverte
    document.addEventListener('touchmove', function(e) {
        if (document.querySelector('.filter-popup.show')) {
            if (!e.target.closest('.popup-content')) {
                e.preventDefault();
            }
        }
    }, { passive: false });

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
        debug('Erreur: ' + (event.error?.message || 'Erreur inconnue'));
    });
}

/**
 * Remplit les listes de filtres avec les options disponibles
 */
function populateFilterLists() {
    // Vider les listes existantes
    if (categoriesList) categoriesList.innerHTML = '';
    if (provenanceList) provenanceList.innerHTML = '';
    
    // Remplir la liste des catégories
    if (categoriesList) {
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
                if (categoriesFilter) categoriesFilter.textContent = categorie;
                closeAllPopups();
                renderPlants();
                debug(`Catégorie sélectionnée: ${categorie}`);
            });
            categoriesList.appendChild(li);
        });
    }

    // Remplir la liste des provenances
    if (provenanceList) {
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
                if (provenanceFilter) provenanceFilter.textContent = provenance;
                closeAllPopups();
                renderPlants();
                debug(`Provenance sélectionnée: ${provenance}`);
            });
            provenanceList.appendChild(li);
        });
    }
}

/**
 * Affiche ou masque une popup de filtre
 */
function togglePopup(popup) {
    console.log("Affichage de la popup:", popup.id);
    if (!popup) {
        console.error("La popup est undefined!");
        return;
    }
    
    closeAllPopups();
    popup.classList.add('show');
    if (overlay) overlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // Empêcher le défilement du fond
}

/**
 * Ferme toutes les popups ouvertes
 */
function closeAllPopups() {
    console.log("Fermeture de toutes les popups");
    document.querySelectorAll('.filter-popup').forEach(popup => {
        popup.classList.remove('show');
    });
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = ''; // Réactiver le défilement
}

/**
 * Filtre et affiche les plantes selon les critères sélectionnés
 */
function renderPlants() {
    if (!plantsContainer) {
        console.error("Le conteneur des plantes n'a pas été trouvé!");
        return;
    }
    
    // Afficher un indicateur de chargement si nécessaire
    if (isLoading) {
        plantsContainer.innerHTML = '<div class="message">Chargement en cours...</div>';
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
        if (!template) {
            console.error("Le template de carte n'a pas été trouvé!");
            return;
        }
        
        const clone = document.importNode(template.content, true);
        
        // Utiliser l'image de la plante ou une image de substitution
        const imgElement = clone.querySelector('.card-image img');
        if (imgElement) {
            if (plante.image) {
                imgElement.src = plante.image;
            } else {
                // Utiliser une image de substitution
                const placeholderIndex = index % (window.appData?.placeholderImages?.length || 4);
                const placeholderSrc = window.appData?.placeholderImages?.[placeholderIndex] || './img/placeholder1.jpg';
                imgElement.src = placeholderSrc;
            }
            imgElement.alt = plante.nom;
        }
        
        const nameEl = clone.querySelector('.plant-name');
        if (nameEl) nameEl.textContent = plante.nom;
        
        const typeEl = clone.querySelector('.plant-type');
        if (typeEl) typeEl.textContent = plante.type;
        
        // Ajouter la catégorie comme tag
        const hashTag = clone.querySelector('.hash-tag');
        if (hashTag) hashTag.textContent = plante.categorie;
        
        // Ajouter l'événement de clic sur la carte
        const card = clone.querySelector('.plant-card');
        if (card) {
            card.addEventListener('click', () => {
                showPlantDetails(plante);
            });
        }
        
        plantsContainer.appendChild(clone);
    });
    
    // Afficher un message si aucune plante ne correspond
    if (plantesFiltrees.length === 0) {
        plantsContainer.innerHTML = '<div class="message">Aucune plante ne correspond à ces critères</div>';
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
        
        ${plante.description || "Aucune description disponible"}
        
        Prix: 
        - À l'unité: ${plante.prix.unite}
        - Par 3: ${plante.prix.par_3}
        - Par 5: ${plante.prix.par_5}
        
        ${plante.videos?.length || 0} vidéo(s) disponible(s)
    `;
    
    try {
        tg.showPopup({
            title: plante.nom,
            message: message,
            buttons: [
                {text: "Fermer", type: "cancel"},
                {text: "Contacter", type: "default"}
            ]
        }, function(buttonId) {
            if (buttonId === 1) { // "Contacter" est le deuxième bouton, donc index 1
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
        });
    } catch (e) {
        console.error("Erreur lors de l'affichage de la popup:", e);
        alert(message);
    }
}

/**
 * Applique les couleurs du thème Telegram si disponibles
 */
function applyTelegramTheme() {
    try {
        console.log("Application du thème Telegram:", tg.themeParams);
        
        if (tg.themeParams) {
            // Couleurs principales
            document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#212121');
            document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#8774e1');
            document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#2c2c2c');
            
            // Appliquer directement aux éléments d'en-tête
            const header = document.querySelector('.header');
            if (header) {
                header.style.backgroundColor = tg.themeParams.bg_color || '#212121';
                header.style.color = tg.themeParams.text_color || '#ffffff';
            }
            
            // Appliquer aux boutons de filtre
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.style.borderColor = tg.themeParams.button_color || '#8774e1';
            });
            
            // Appliquer à la barre de navigation
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.style.backgroundColor = tg.themeParams.secondary_bg_color || '#2c2c2c';
            }
        }
    } catch (e) {
        console.error("Erreur lors de l'application du thème:", e);
    }
} 
