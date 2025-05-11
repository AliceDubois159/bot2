/**
 * Script pour récupérer les données depuis Airtable et les enregistrer dans un fichier JSON
 * Ce script est conçu pour être exécuté via GitHub Actions
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Charger les variables d'environnement depuis .env si disponible (pour dev local)
try {
  if (fs.existsSync(path.join(__dirname, '.env'))) {
    require('dotenv').config();
    console.log('Variables d\'environnement chargées depuis .env');
  }
} catch (error) {
  console.log('Pas de fichier .env trouvé, utilisation des variables d\'environnement système');
}

// Récupérer les variables d'environnement
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Plantes';

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('Les variables d\'environnement AIRTABLE_API_KEY et AIRTABLE_BASE_ID doivent être définies');
  process.exit(1);
}

// URL de l'API Airtable
const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

// Fonction pour récupérer les données depuis Airtable
async function fetchDataFromAirtable() {
  console.log('Récupération des données depuis Airtable...');
  
  try {
    const response = await axios.get(AIRTABLE_URL, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status !== 200) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const records = response.data.records;
    console.log(`${records.length} enregistrements récupérés.`);
    
    // Transformation des données Airtable en format attendu par l'application
    const categories = [];
    const provenances = [];
    const plantes = [];
    
    // Extraction des catégories et provenances uniques
    records.forEach(record => {
      const fields = record.fields;
      
      // Ajouter la catégorie si elle n'existe pas déjà
      if (fields.Categorie && !categories.includes(fields.Categorie)) {
        categories.push(fields.Categorie);
      }
      
      // Ajouter la provenance si elle n'existe pas déjà
      if (fields.Provenance && !provenances.includes(fields.Provenance)) {
        provenances.push(fields.Provenance);
      }
      
      // Extraction des prix
      const prix = {};
// Prix standards déjà supportés
if (fields['Prix 3.5g']) prix['3.5g'] = fields['Prix 3.5g'];
if (fields['Prix 5g']) prix['5g'] = fields['Prix 5g'];
if (fields['Prix 10g']) prix['10g'] = fields['Prix 10g'];
if (fields['Prix 25g']) prix['25g'] = fields['Prix 25g'];
if (fields['Prix 50g']) prix['50g'] = fields['Prix 50g'];
if (fields['Prix 100g']) prix['100g'] = fields['Prix 100g'];
if (fields['Prix 500g']) prix['500g'] = fields['Prix 500g'];
if (fields['Prix 1kg']) prix['1kg'] = fields['Prix 1kg'];
if (fields['Prix 2kg']) prix['2kg'] = fields['Prix 2kg'];
      
      // Création de l'objet plante
      const plante = {
        id: record.id,
        nom: fields.Nom || 'Sans nom',
        type: fields.Type || '',
        categorie: fields.Categorie || '',
        provenance: fields.Provenance || '',
        image: fields.Image ? fields.Image[0].url : null,
        prix: prix,
        videos: fields.Videos ? fields.Videos.map(v => v.url) : [],
        description: fields.Description || ''
      };
      
      plantes.push(plante);
    });
    
    // Ajouter les options par défaut pour les filtres
    categories.unshift('Toutes les catégories');
    provenances.unshift('Toutes les provenances');
    
    // Créer l'objet de données final
    const data = {
      categories,
      provenances,
      plantes
    };
    
    return data;
    
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error.message);
    throw error;
  }
}

// Fonction pour enregistrer les données dans un fichier JSON
// Fonction pour enregistrer les données dans un fichier JSON
async function saveDataToFile(data) {
  console.log('Enregistrement des données dans un fichier JSON...');
  
  // Créer le dossier data s'il n'existe pas
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Chemin du fichier JSON
  const dataFilePath = path.join(dataDir, 'data.json');
  
  // Créer une sauvegarde du fichier existant
  if (fs.existsSync(dataFilePath)) {
    const backupFilePath = path.join(dataDir, `data.json.backup-${Date.now()}`);
    fs.copyFileSync(dataFilePath, backupFilePath);
    console.log(`Sauvegarde créée: ${backupFilePath}`);
  }
  
  try {
    // Convertir en chaîne JSON puis valider en reparsant
    const jsonString = JSON.stringify(data, null, 2);
    JSON.parse(jsonString); // Si cette ligne échoue, le JSON est invalide
    
    // Enregistrer sans BOM en spécifiant explicitement l'encodage UTF-8
    fs.writeFileSync(dataFilePath, jsonString, { encoding: 'utf8' });
    
    // Vérification supplémentaire : s'assurer que le fichier commence par {
    const firstChar = fs.readFileSync(dataFilePath, { encoding: 'utf8' }).charAt(0);
    if (firstChar !== '{') {
      throw new Error(`Le fichier JSON ne commence pas par { mais par "${firstChar}"`);
    }
    
    console.log(`Données enregistrées dans ${dataFilePath}`);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du JSON:', error.message);
    throw error;
  }
}

// Fonction principale
async function main() {
  try {
    const data = await fetchDataFromAirtable();
    await saveDataToFile(data);
    console.log('Mise à jour des données terminée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données:', error.message);
    process.exit(1);
  }
}

// Exécuter la fonction principale
main(); 
