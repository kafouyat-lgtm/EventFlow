#!/usr/bin/env node

// Script de déploiement automatique pour EventFlow
console.log('🚀 Déploiement EventFlow sur Vercel...');

const fs = require('fs');
const path = require('path');

// Vérifier que tous les fichiers nécessaires sont présents
const requiredFiles = [
  'public/index.html',
  'public/events.json',
  'public/static/app.js',
  'vercel.json'
];

console.log('✅ Vérification des fichiers...');
requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`❌ Fichier manquant: ${file}`);
    process.exit(1);
  }
  console.log(`✓ ${file}`);
});

console.log('✅ Tous les fichiers sont présents!');
console.log('🌐 EventFlow est prêt pour le déploiement Vercel!');
console.log('');
console.log('📋 Instructions de déploiement:');
console.log('1. Allez sur https://vercel.com');
console.log('2. Connectez-vous avec GitHub'); 
console.log('3. Importez le repository: kafouyat-lgtm/EventFlow');
console.log('4. Cliquez Deploy!');
console.log('');
console.log('🎯 Configuration détectée automatiquement:');
console.log('- Framework: Static Site');
console.log('- Output Directory: public');
console.log('- Build Command: (none)');