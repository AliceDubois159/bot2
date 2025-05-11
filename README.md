# La Cocina - Application Web

Ce répertoire contient les fichiers à déployer sur GitHub Pages.

## Comment déployer sur GitHub Pages

1. Créez un dépôt GitHub (ou utilisez le dépôt existant alicedubois159/bot2)
2. Téléchargez tous ces fichiers dans le dépôt
3. Dans les paramètres du dépôt GitHub, activez GitHub Pages sur la branche main
4. Configurez les secrets GitHub pour l'accès à Airtable (voir ci-dessous)

## Configuration des secrets GitHub pour Airtable

Pour que l'actualisation automatique des données fonctionne:

1. Dans votre dépôt GitHub, allez dans "Settings" > "Secrets and variables" > "Actions"
2. Cliquez sur "New repository secret"
3. Ajoutez les secrets suivants :
   - Nom : `AIRTABLE_API_KEY`  
     Valeur : `patyDPr6vjdTh9Jyc.59ab6205d522d9c00dcc41bf603f007cfd1792abae4b4cd740790261f3905429`
   - Nom : `AIRTABLE_BASE_ID`  
     Valeur : `appSCgIw9WWJq4N27`

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

## Développement local

Pour tester l'application en local:

1. Installez Node.js et npm
2. Exécutez `npm install` pour installer les dépendances
3. Créez un fichier `.env` avec vos clés Airtable:
   ```
   AIRTABLE_API_KEY=patyDPr6vjdTh9Jyc.59ab6205d522d9c00dcc41bf603f007cfd1792abae4b4cd740790261f3905429
   AIRTABLE_BASE_ID=appSCgIw9WWJq4N27
   AIRTABLE_TABLE_NAME=Plantes
   ```
4. Exécutez `npm run update-data` pour générer le fichier `data/data.json`
5. Utilisez un serveur local comme `live-server` ou `http-server` pour servir les fichiers 