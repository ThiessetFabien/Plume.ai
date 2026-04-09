const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REQUIRED_FILES = [
  'src/services/api.js',
  'src/theme/colors.js',
  'src/screens/DashboardScreen.js',
  'src/screens/HistoryScreen.js',
  'package.json'
];

const mobileDir = __dirname;
let errors = 0;

console.log("🛡️  Démarrage du Pre-commit Check Mobile (Rescue Mode)...");

// 1. Vérification de la structure
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

// 2. Vérification de la syntaxe JS (Node Check)
console.log("\n🔍 Vérification de la syntaxe JS :");
[
  'src/screens/DashboardScreen.js',
  'src/screens/HistoryScreen.js',
  'src/screens/AttendanceScreen.js',
  'src/screens/ReservationScreen.js',
  'App.js'
].forEach(file => {
  const fullPath = path.join(mobileDir, file);
  if (fs.existsSync(fullPath)) {
    try {
      execSync(`node --check "${fullPath}"`);
      console.log(`  ✅ ${file} (Syntaxe OK)`);
    } catch (err) {
      console.log(`  ❌ ${file} (Erreur de syntaxe détectée !)`);
      console.error(err.message);
      errors++;
    }
  }
});

// 3. Vérification des dépendances (Shallow check)
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

// 4. Heuristique simple de "Style Linting" (cible DashboardScreen)
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

    // Bonus: Check for legacy borderWIdth
    if (content.includes('borderWIdth')) {
       console.log("  ❌ Détection d'une faute de frappe 'borderWIdth' !");
       errors++;
    }
}

// 5. Résumé
console.log("\n---");
if (errors > 0) {
  console.log(`❌ Audit échoué avec ${errors} erreur(s). Corrigez avant de relancer le bundler.`);
  process.exit(1);
} else {
  console.log("🚀 Audit réussi ! Le socle mobile est stabilisé avec hoisting pnpm.");
  process.exit(0);
}
