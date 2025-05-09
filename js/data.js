/**
 * Données de secours pour la mini-application Telegram.
 * Ces données seront utilisées uniquement si le chargement depuis l'API échoue.
 */

// Catégories de plantes
const categories = [
    "Toutes les catégories",
    "Orchidées",
    "Cactus",
    "Plantes d'intérieur",
    "Plantes d'extérieur",
    "Arbres fruitiers"
];

// Provenances des plantes
const provenances = [
    "Toutes les provenances",
    "France",
    "Espagne",
    "Italie",
    "Pays-Bas",
    "Belgique"
];

// Données des plantes
const plantes = [
    {
        id: 1,
        nom: "Permanent Market",
        type: "Cali Plates",
        categorie: "Orchidées",
        provenance: "France",
        image: null, // Sera remplacé par une image de placeholder
        prix: {
            unite: "25€",
            par_3: "65€",
            par_5: "100€"
        },
        videos: [
            "https://example.com/videos/orchidee_france_1.mp4",
            "https://example.com/videos/orchidee_france_2.mp4"
        ],
        description: "Orchidées produites en France, cultivées dans des serres écologiques."
    },
    {
        id: 2,
        nom: "Moonboots",
        type: "Cali Plates",
        categorie: "Orchidées",
        provenance: "Espagne",
        image: null,
        prix: {
            unite: "22€",
            par_3: "60€",
            par_5: "90€"
        },
        videos: [
            "https://example.com/videos/orchidee_espagne_1.mp4",
            "https://example.com/videos/orchidee_espagne_2.mp4"
        ],
        description: "Orchidées d'Espagne, particulièrement résistantes et colorées."
    },
    {
        id: 3,
        nom: "Silver Haze",
        type: "Cali Plates",
        categorie: "Cactus",
        provenance: "France",
        image: null,
        prix: {
            unite: "15€",
            par_3: "40€",
            par_5: "60€"
        },
        videos: [
            "https://example.com/videos/cactus_france_1.mp4"
        ],
        description: "Cactus cultivés en France, parfaits pour les intérieurs ensoleillés."
    },
    {
        id: 4,
        nom: "Desert Rose",
        type: "Cali Plates",
        categorie: "Cactus",
        provenance: "Italie",
        image: null,
        prix: {
            unite: "18€",
            par_3: "45€",
            par_5: "70€"
        },
        videos: [
            "https://example.com/videos/cactus_italie_1.mp4"
        ],
        description: "Cactus importés d'Italie, variétés rares et exotiques."
    }
];

// Images de remplacement pour les exemples
const placeholderImages = [
    "./img/placeholder1.jpg",
    "./img/placeholder2.jpg",
    "./img/placeholder3.jpg",
    "./img/placeholder4.jpg"
];

// Exporter les données pour qu'elles soient utilisables comme secours
window.appData = {
    categories,
    provenances,
    plantes,
    placeholderImages
}; 