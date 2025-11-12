# 🎨 Guide du Système de Couleurs Thématiques

## 📋 Vue d'ensemble

Ce système fournit 4 couleurs thématiques avec support automatique des modes clair/sombre :

- **Info** (Bleu) : Informations, notifications neutres
- **Success** (Vert) : Validations, confirmations, succès
- **Danger** (Rouge) : Erreurs, suppressions, états critiques
- **Warning** (Jaune) : Avertissements, attention requise

Chaque couleur a 3 variantes : `lighter`, `normal`, `darker` + `foreground` pour le texte.

## 🏗️ Architecture

### 📁 Fichiers clés

```
src/
├── styles.css                    # ⭐ SOURCE DE VÉRITÉ - Toutes les couleurs CSS
├── components/ui/
│   ├── color-theme.ts           # Documentation et utilitaires TypeScript
│   ├── alert.tsx                # Composant Alert avec variantes
│   ├── badge.tsx                # Composant Badge avec variantes
│   └── button.tsx               # Composant Button avec variantes
```

### ⚠️ IMPORTANT : Où modifier les couleurs

**✅ Pour changer une couleur, éditez uniquement `src/styles.css`**

```css
/* src/styles.css */

:root {
  /* Info (Bleu) - Mode clair */
  --info-lighter: oklch(0.95 0.05 240);
  --info: oklch(0.65 0.15 240);        /* 👈 Modifiez ici */
  --info-darker: oklch(0.45 0.2 240);
  --info-foreground: oklch(0.98 0 0);
}

.dark {
  /* Info (Bleu) - Mode sombre */
  --info-lighter: oklch(0.55 0.18 240);
  --info: oklch(0.6 0.2 240);          /* 👈 Et ici pour le dark mode */
  --info-darker: oklch(0.35 0.15 240);
  --info-foreground: oklch(0.98 0 0);
}
```

**❌ NE MODIFIEZ PAS** les composants individuellement (Alert, Badge, Button, etc.)

## 🚀 Utilisation

### 1. Composants UI pré-stylés

#### Alert

```tsx
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";

// Warning Alert
<Alert variant="warning">
  <AlertTriangleIcon />
  <AlertTitle>Attention requise</AlertTitle>
  <AlertDescription>
    Votre session va expirer dans 5 minutes.
  </AlertDescription>
</Alert>

// Info Alert
<Alert variant="info">
  <InfoIcon />
  <AlertTitle>Nouvelle fonctionnalité</AlertTitle>
  <AlertDescription>
    Découvrez notre nouveau système de notifications.
  </AlertDescription>
</Alert>

// Success Alert
<Alert variant="success">
  <CheckCircle2Icon />
  <AlertTitle>Opération réussie</AlertTitle>
  <AlertDescription>
    Votre profil a été mis à jour avec succès.
  </AlertDescription>
</Alert>

// Danger Alert
<Alert variant="danger">
  <AlertCircleIcon />
  <AlertTitle>Erreur critique</AlertTitle>
  <AlertDescription>
    Impossible de se connecter au serveur.
  </AlertDescription>
</Alert>
```

#### Badge

```tsx
import { Badge } from "~/components/ui/badge";

// Variantes normales
<Badge variant="info">Nouveau</Badge>
<Badge variant="success">Complété</Badge>
<Badge variant="danger">Erreur</Badge>
<Badge variant="warning">En attente</Badge>

// Variantes claires
<Badge variant="info-light">Info Light</Badge>
<Badge variant="success-light">Success Light</Badge>

// Variantes foncées
<Badge variant="danger-dark">Danger Dark</Badge>
<Badge variant="warning-dark">Warning Dark</Badge>

// Variantes outline
<Badge variant="info-outline">Info Outline</Badge>
<Badge variant="success-outline">Success Outline</Badge>
```

#### Button

```tsx
import { Button } from "~/components/ui/button";

// Boutons pleins
<Button variant="info">En savoir plus</Button>
<Button variant="success">Enregistrer</Button>
<Button variant="danger">Supprimer</Button>
<Button variant="warning">Attention</Button>

// Boutons outline
<Button variant="info-outline">Documentation</Button>
<Button variant="success-outline">Valider</Button>
<Button variant="danger-outline">Annuler</Button>
<Button variant="warning-outline">Vérifier</Button>
```

### 2. Classes Tailwind directes

```tsx
// Background avec la couleur
<div className="bg-info text-info-foreground p-4 rounded">
  Message d'information
</div>

<div className="bg-success text-success-foreground p-4 rounded">
  Opération réussie
</div>

// Background avec variantes
<div className="bg-info-lighter">Plus clair</div>
<div className="bg-info">Normal</div>
<div className="bg-info-darker">Plus foncé</div>

// Bordures
<div className="border-2 border-danger">Bordure rouge</div>

// Texte
<p className="text-warning">Texte d'avertissement</p>

// Ring (focus)
<input className="ring-2 ring-info" />
```

### 3. Composants personnalisés

```tsx
import { colorClasses } from "~/components/ui/color-theme";
import { cn } from "~/lib/utils";

function CustomAlert({ type, children }: { type: "info" | "success" | "danger" | "warning"; children: React.ReactNode }) {
  return (
    <div className={cn(
      "p-4 rounded-lg",
      colorClasses[type].bg,
      colorClasses[type].textForeground
    )}>
      {children}
    </div>
  );
}

// Utilisation
<CustomAlert type="warning">Attention !</CustomAlert>
```

### 4. Styles inline avec CSS variables

```tsx
function CustomComponent() {
  return (
    <div style={{
      backgroundColor: 'var(--info)',
      color: 'var(--info-foreground)',
      padding: '1rem',
      borderRadius: '0.5rem'
    }}>
      Message avec styles inline
    </div>
  );
}
```

## 🎨 Palette de couleurs

### Info (Bleu)

| Variante | Mode Clair | Mode Sombre | Usage |
|----------|-----------|-------------|-------|
| `lighter` | `oklch(0.95 0.05 240)` | `oklch(0.55 0.18 240)` | Backgrounds légers |
| `normal` | `oklch(0.65 0.15 240)` | `oklch(0.6 0.2 240)` | Couleur principale |
| `darker` | `oklch(0.45 0.2 240)` | `oklch(0.35 0.15 240)` | Accents, hover |
| `foreground` | `oklch(0.98 0 0)` | `oklch(0.98 0 0)` | Texte sur fond coloré |

### Success (Vert)

| Variante | Mode Clair | Mode Sombre | Usage |
|----------|-----------|-------------|-------|
| `lighter` | `oklch(0.95 0.08 150)` | `oklch(0.55 0.2 150)` | Backgrounds légers |
| `normal` | `oklch(0.65 0.18 150)` | `oklch(0.6 0.22 150)` | Couleur principale |
| `darker` | `oklch(0.45 0.2 150)` | `oklch(0.35 0.18 150)` | Accents, hover |
| `foreground` | `oklch(0.98 0 0)` | `oklch(0.98 0 0)` | Texte sur fond coloré |

### Danger (Rouge)

| Variante | Mode Clair | Mode Sombre | Usage |
|----------|-----------|-------------|-------|
| `lighter` | `oklch(0.95 0.08 25)` | `oklch(0.6 0.2 25)` | Backgrounds légers |
| `normal` | `oklch(0.65 0.22 25)` | `oklch(0.7 0.19 22)` | Couleur principale |
| `darker` | `oklch(0.45 0.25 25)` | `oklch(0.4 0.22 25)` | Accents, hover |
| `foreground` | `oklch(0.98 0 0)` | `oklch(0.98 0 0)` | Texte sur fond coloré |

### Warning (Jaune)

| Variante | Mode Clair | Mode Sombre | Usage |
|----------|-----------|-------------|-------|
| `lighter` | `oklch(0.95 0.08 85)` | `oklch(0.7 0.15 85)` | Backgrounds légers |
| `normal` | `oklch(0.75 0.18 85)` | `oklch(0.75 0.18 85)` | Couleur principale |
| `darker` | `oklch(0.55 0.2 85)` | `oklch(0.5 0.16 85)` | Accents, hover |
| `foreground` | `oklch(0.2 0 0)` | `oklch(0.15 0 0)` | Texte sombre pour contraste |

## 📐 Bonnes pratiques

### ✅ À faire

- **Utiliser les composants UI** (Alert, Badge, Button) pour la cohérence
- **Tester dans les deux thèmes** (clair et sombre)
- **Utiliser les variantes appropriées** :
  - `info` pour informations neutres
  - `success` pour confirmations positives
  - `danger` pour actions destructives
  - `warning` pour attirer l'attention
- **Modifier les couleurs uniquement dans `styles.css`**
- **Vérifier le contraste** pour l'accessibilité

### ❌ À éviter

- Ne pas mélanger trop de couleurs sur un même écran
- Ne pas utiliser `danger` pour des actions non-destructives
- Ne pas oublier de tester le mode sombre
- Ne pas modifier les couleurs directement dans les composants
- Ne pas surcharger l'interface avec des alertes/badges

## 🔧 Comment modifier les couleurs

### Exemple : Changer la couleur Info en violet

1. **Ouvrez `src/styles.css`**

2. **Modifiez les valeurs OKLCH** :

```css
:root {
  /* Info colors - Changé de bleu à violet */
  --info-lighter: oklch(0.95 0.05 300);  /* 240 → 300 */
  --info: oklch(0.65 0.15 300);          /* 240 → 300 */
  --info-darker: oklch(0.45 0.2 300);    /* 240 → 300 */
  --info-foreground: oklch(0.98 0 0);
}

.dark {
  /* Info colors Dark - Changé de bleu à violet */
  --info-lighter: oklch(0.55 0.18 300);  /* 240 → 300 */
  --info: oklch(0.6 0.2 300);            /* 240 → 300 */
  --info-darker: oklch(0.35 0.15 300);   /* 240 → 300 */
  --info-foreground: oklch(0.98 0 0);
}
```

3. **Sauvegardez** - Tous les composants sont automatiquement mis à jour ! 🎉

### Format OKLCH

```
oklch(lightness chroma hue)
```

- **Lightness** (0-1) : Luminosité (0 = noir, 1 = blanc)
- **Chroma** (0-0.4) : Saturation (0 = gris, 0.4 = très saturé)
- **Hue** (0-360) : Teinte (0 = rouge, 120 = vert, 240 = bleu, 300 = violet)

## 🎯 Cas d'usage pratiques

### Formulaire avec validation

```tsx
<div className="space-y-4">
  {/* Champ valide */}
  <div>
    <input className="border-success" />
    <Badge variant="success-light">✓ Email valide</Badge>
  </div>

  {/* Champ invalide */}
  <div>
    <input className="border-danger" />
    <Badge variant="danger-light">✗ Mot de passe trop court</Badge>
  </div>

  <Button variant="success">Enregistrer</Button>
</div>
```

### Dashboard avec statuts

```tsx
<div className="space-y-3">
  <div className="flex items-center justify-between">
    <span>Serveur Principal</span>
    <Badge variant="success-light">En ligne</Badge>
  </div>

  <div className="flex items-center justify-between">
    <span>Base de données</span>
    <Badge variant="warning-light">Lent</Badge>
  </div>

  <div className="flex items-center justify-between">
    <span>Service Email</span>
    <Badge variant="danger-light">Hors ligne</Badge>
  </div>
</div>
```

### Notifications

```tsx
<Alert variant="warning">
  <AlertTriangleIcon />
  <AlertTitle>Session expirante</AlertTitle>
  <AlertDescription>
    Votre session va expirer dans 5 minutes.
    <Button variant="warning" className="mt-2">
      Prolonger la session
    </Button>
  </AlertDescription>
</Alert>
```

## 🔍 Dépannage

### Les couleurs ne s'affichent pas

1. Vérifiez que `styles.css` est importé dans votre app
2. Vérifiez que les variables CSS sont définies dans `:root` et `.dark`
3. Videz le cache du navigateur

### Les couleurs ne changent pas avec le thème

1. Vérifiez que le thème est bien géré (ThemeProvider)
2. Vérifiez que `.dark` est ajouté à l'élément `<html>` ou `<body>`
3. Vérifiez que les variables sont définies dans `.dark`

### Problèmes de contraste

- Utilisez les variantes `foreground` pour le texte sur fond coloré
- Testez avec des outils d'accessibilité
- Ajustez la luminosité dans OKLCH si nécessaire

## 📚 Ressources

- [Documentation OKLCH](https://oklch.com/)
- [Tailwind CSS Variables](https://tailwindcss.com/docs/customizing-colors#using-css-variables)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)

---

**Dernière mise à jour** : 2024
**Mainteneur** : Votre équipe dev 🚀
