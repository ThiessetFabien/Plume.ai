/**
 * Plume.ai Mobile - Verification Infra & QA
 * Ce script valide la structure et la cohérence technique avant chaque commit.
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'src/services/api.js',
  'src/theme/colors.js',
  'src/screens/DashboardScreen.js',
  'package.json'
];

const mobileDir = __dirname;
let errors = 0;

console.log("🛡️  Démarrage du Pre-commit Check Mobile...");

// 1. Vérification des fichiers critiques
console.log("\n📁 Vérification de la structure :");
REQUIRED_FILES.forEach(file => {
  const fullPath = path.join(mobileDir, file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} (MANQUANT)`);
    errors++;
  }
});

// 2. Vérification des dépendances (Shallow check)
const pkg = require(path.join(mobileDir, 'package.json'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
const essentialDeps = ['axios', 'expo-constants', '@react-navigation/native', 'lucide-react-native'];

console.log("\n📦 Vérification des dépendances essentielles :");
essentialDeps.forEach(dep => {
  if (deps[dep]) {
    console.log(`  ✅ ${dep}`);
  } else {
    console.log(`  ❌ ${dep} (Absent de package.json)`);
    errors++;
  }
});

// 3. Heuristique simple de "Style Linting" (cible DashboardScreen)
console.log("\n🧹 Vérification des styles orphelins (Heuristique Dashboard) :");
const targetFile = path.join(mobileDir, 'src/screens/DashboardScreen.js');
if (fs.existsSync(targetFile)) {
    const content = fs.readFileSync(targetFile, 'utf8');
    const definedStyles = content.match(/([a-zA-Z0-9]+):\s*{/g) || [];

    definedStyles.forEach(s => {
      const styleName = s.replace(/:\s*{/, '').trim();
      if (styleName !== 'container' && !content.includes(`styles.${styleName}`)) {
        console.log(`  ⚠️  Style '${styleName}' défini mais semble inutilisé.`);
      } else {
        console.log(`  ✅ Style '${styleName}' utilisé.`);
      }
    });
}

// 4. Résumé
console.log("\n---");
if (errors === 0) {
  console.log("🚀 Validation réussie ! Le socle mobile est stable et propre.");
  process.exit(0);
} else {
  console.log(`⚠️  Échec de la validation (${errors} erreur(s)).`);
  process.exit(1);
}
