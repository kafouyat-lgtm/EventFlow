#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🚀 Déploiement automatique EventFlow sur Vercel...');

// Configuration du projet pour Vercel
const projectConfig = {
  name: 'eventflow',
  framework: null, // Site statique
  buildCommand: null,
  outputDirectory: 'public',
  installCommand: null,
  devCommand: null
};

console.log('📦 Configuration du projet:');
console.log(JSON.stringify(projectConfig, null, 2));

// Vérifier les fichiers critiques
const criticalFiles = [
  'public/index.html',
  'public/events.json', 
  'public/static/app.js',
  'vercel.json'
];

console.log('\n✅ Vérification des fichiers critiques...');
let allFilesPresent = true;

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`✓ ${file} (${Math.round(stats.size/1024)}KB)`);
  } else {
    console.log(`❌ ${file} - MANQUANT`);
    allFilesPresent = false;
  }
});

if (!allFilesPresent) {
  console.log('\n❌ Des fichiers critiques sont manquants!');
  process.exit(1);
}

console.log('\n🎯 Statistiques du projet:');
console.log(`- Taille totale: ${getDirSize('public')}KB`);
console.log(`- Fichiers: ${getFileCount('public')}`);
console.log('- Type: Site statique');
console.log('- Framework: Aucun (HTML/CSS/JS)');

console.log('\n🌐 EventFlow est 100% prêt pour Vercel!');
console.log('\n📋 DÉPLOIEMENT MANUEL REQUIS:');
console.log('1. 🌐 Allez sur: https://vercel.com/new');
console.log('2. 🔗 Sélectionnez: "Import Git Repository"'); 
console.log('3. 📁 Choisissez: kafouyat-lgtm/EventFlow');
console.log('4. ⚙️ Configuration automatique détectée');
console.log('5. 🚀 Cliquez "Deploy"');
console.log('\n🎉 URL finale: https://eventflow-[id].vercel.app');

function getDirSize(dir) {
  let size = 0;
  function traverse(currentPath) {
    const files = fs.readdirSync(currentPath);
    files.forEach(file => {
      const filePath = path.join(currentPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        traverse(filePath);
      } else {
        size += stats.size;
      }
    });
  }
  if (fs.existsSync(dir)) traverse(dir);
  return Math.round(size / 1024);
}

function getFileCount(dir) {
  let count = 0;
  function traverse(currentPath) {
    const files = fs.readdirSync(currentPath);
    files.forEach(file => {
      const filePath = path.join(currentPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        traverse(filePath);
      } else {
        count++;
      }
    });
  }
  if (fs.existsSync(dir)) traverse(dir);
  return count;
}