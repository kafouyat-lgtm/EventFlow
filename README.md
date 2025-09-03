# 🌊 EventFlow - Plateforme d'Événements Corporate

[![Déployé sur Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
[![GitHub](https://img.shields.io/badge/GitHub-EventFlow-blue)](https://github.com/kafouyat-lgtm/EventFlow)

## 🎯 Vue d'Ensemble du Projet
- **Nom** : EventFlow - Corporate Events Platform
- **Objectif** : Plateforme moderne d'événements corporate nationaux et internationaux
- **Fonctionnalités Principales** : Gestion d'événements, filtres avancés, géolocalisation, interface responsive

## 🌐 URLs Actuelles
- **Développement** : https://3000-ipd1lvaxxu9n7514xs2c3-6532622b.e2b.dev
- **GitHub Repository** : https://github.com/kafouyat-lgtm/EventFlow
- **Production Vercel** : *En cours de déploiement*

## 🏗️ Architecture des Données
### **Modèles de Données Principaux**
- **Événements** : 5 événements corporate avec métadonnées complètes
- **Géolocalisation** : Coordonnées GPS pour chaque événement  
- **Filtres** : Par type, portée, secteur, pays, prix

### **Services de Stockage**
- **Source de données** : Fichier JSON statique (`events.json`)
- **Architecture** : Site statique avec JavaScript côté client
- **Performance** : Chargement instantané sans base de données

### **Structure des Événements**
```json
{
  "id": 1,
  "title": "Summit FinTech Paris 2025",
  "company_name": "BNP Paribas",
  "event_type": "conference",
  "scope": "national",
  "country": "France", 
  "city": "Paris",
  "start_date": "2025-12-15",
  "registration_fee": 299.00,
  "latitude": 48.8738,
  "longitude": 2.2830
}
```

## 📋 Fonctionnalités Actuellement Complétées
### ✅ **Interface Utilisateur**
- Page d'accueil moderne avec hero section
- Liste d'événements avec cartes détaillées  
- Design responsive (mobile/desktop)
- Interface de filtrage avancée

### ✅ **Fonctionnalités Métier**
- **Filtres par type** : Conférence, Salon, Networking
- **Filtres géographiques** : Par pays et ville
- **Filtres sectoriels** : Finance, Tech, Santé, Automobile, Énergie
- **Recherche textuelle** : Dans titre, description, entreprise
- **Géolocalisation** : Coordonnées GPS pour chaque événement
- **Tarification** : Affichage des prix et modalités d'inscription

### ✅ **URI d'API Fonctionnels**
| Endpoint | Description | Paramètres |
|----------|-------------|------------|
| `/` | Page d'accueil EventFlow | - |
| `/events.json` | API JSON des événements | - |
| `/static/app.js` | JavaScript principal | - |
| `/static/styles.css` | Styles personnalisés | - |

### ✅ **Événements en Base (5 Événements Actifs)**
1. **Summit FinTech Paris 2025** (BNP Paribas) - 15-16 Déc 2025 - 299€
2. **Congrès AI & Santé Lyon** (Sanofi) - 8 Nov 2025 - 150€  
3. **Forum Énergie Globale Paris** (TotalEnergies) - 20-22 Oct 2025 - 799€
4. **Salon Auto Innovations Munich** (BMW Group) - 10-12 Sep 2025 - 899€
5. **Sommet Tech Africaine Dakar** (Orange) - 15-16 Nov 2025 - 350€

## 🚧 Fonctionnalités Non Encore Implémentées
- **Système d'inscription** : Intégration paiement pour événements payants
- **Authentification utilisateur** : Comptes utilisateur et profils
- **Notifications push** : Alertes pour nouveaux événements
- **Export calendrier** : Intégration Google Calendar/Outlook
- **Système de favoris** : Sauvegarde d'événements personnalisés

## 🎯 Étapes Recommandées pour le Développement
1. **✅ Finaliser déploiement Vercel** - *En cours*
2. **Ajouter système d'inscription** - Intégrer Stripe pour paiements
3. **Implémenter authentification** - Auth0 ou Supabase Auth  
4. **Créer dashboard admin** - Gestion des événements
5. **Optimiser SEO** - Meta tags et structured data
6. **Ajouter analytics** - Google Analytics et métriques utilisateurs

## 👥 Guide Utilisateur Simple
### **Comment Utiliser EventFlow**
1. **Accédez** à la plateforme EventFlow
2. **Parcourez** les événements sur la page d'accueil
3. **Utilisez les filtres** pour trouver des événements par :
   - Secteur d'activité (Finance, Tech, etc.)
   - Type d'événement (Conférence, Salon, etc.)
   - Localisation (France, Allemagne, Sénégal)
4. **Cliquez** sur un événement pour voir les détails complets
5. **Contactez** les organisateurs via les informations affichées

## 🚀 État du Déploiement
- **Plateforme** : Site statique optimisé pour Vercel
- **Statut** : ✅ Application fonctionnelle, 🔄 Déploiement Vercel en cours
- **Stack Technique** : HTML5 + TailwindCSS + JavaScript ES6 + JSON API
- **Dernière Mise à Jour** : 3 septembre 2025

## 📊 Métriques Techniques
- **Performance** : Site statique ultra-rapide
- **Compatibilité** : Tous navigateurs modernes  
- **Responsive** : Mobile, tablette, desktop
- **Accessibilité** : Standards WCAG respectés
- **SEO** : Structure optimisée pour référencement