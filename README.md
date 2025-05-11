# La Cocina - Application Web

Ce répertoire contient les fichiers à déployer sur GitHub Pages.

## Comment déployer sur GitHub Pages
2. Téléchargez tous ces fichiers dans le dépôt
3. Dans les paramètres du dépôt GitHub, activez GitHub Pages sur la branche main
4. Configurez les secrets GitHub pour l'accès à Airtable (voir ci-dessous)


## Actualisation des données

Cette application récupère les données d'Airtable de deux façons:

1. **Automatiquement** : GitHub Actions exécute le script `data_updater.js` toutes les heures pour mettre à jour le fichier `data/data.json`
2. **Manuellement** : Vous pouvez déclencher une actualisation depuis l'onglet "Actions" de votre dépôt en cliquant sur "Update Airtable Data" puis "Run workflow"

## Structure des fichiers

- **index.html** - Page principale de l'application
- **simple.html** - Version simplifiée de l'interface
- **contact.html** - Page de contact
- **info.html** - Page d'informations
- **admin.html** - Interface d'administration
- **css/** - Styles CSS
- **js/** - Scripts JavaScript
- **img/** - Images et logos
- **data/** - Dossier contenant les données JSON actualisées depuis Airtable
- **data_updater.js** - Script pour actualiser les données
- **.github/workflows/** - Configuration de l'actualisation automatique
