/**
 * Configuration des couleurs thématiques
 *
 * ⚠️ IMPORTANT : Les couleurs sont définies dans src/styles.css
 * Ce fichier sert uniquement de documentation et d'utilitaires TypeScript
 *
 * Pour modifier les couleurs, éditez les variables CSS dans src/styles.css :
 * - :root pour le mode clair
 * - .dark pour le mode sombre
 */

/**
 * Type pour les noms de couleurs disponibles
 */
export type ColorName = "info" | "success" | "danger" | "warning";

/**
 * Type pour les variantes de couleur
 */
export type ColorVariant = "lighter" | "normal" | "darker";

/**
 * Documentation des couleurs disponibles
 *
 * Ces valeurs correspondent aux variables CSS définies dans styles.css
 */
export const colorTheme = {
  info: {
    cssVar: "--info",
    description: "Bleu - Utilisé pour les informations, notifications et états neutres",
    variants: {
      lighter: "--info-lighter",
      normal: "--info",
      darker: "--info-darker",
      foreground: "--info-foreground",
    },
  },
  success: {
    cssVar: "--success",
    description: "Vert - Utilisé pour les confirmations, validations et états positifs",
    variants: {
      lighter: "--success-lighter",
      normal: "--success",
      darker: "--success-darker",
      foreground: "--success-foreground",
    },
  },
  danger: {
    cssVar: "--danger",
    description: "Rouge - Utilisé pour les erreurs, suppressions et états critiques",
    variants: {
      lighter: "--danger-lighter",
      normal: "--danger",
      darker: "--danger-darker",
      foreground: "--danger-foreground",
    },
  },
  warning: {
    cssVar: "--warning",
    description:
      "Jaune - Utilisé pour les avertissements et situations nécessitant attention",
    variants: {
      lighter: "--warning-lighter",
      normal: "--warning",
      darker: "--warning-darker",
      foreground: "--warning-foreground",
    },
  },
} as const;

/**
 * Classes Tailwind pour chaque couleur thématique
 * Ces classes utilisent les variables CSS définies dans styles.css
 *
 * @example
 * ```tsx
 * import { colorClasses } from "~/components/ui/color-theme";
 *
 * <div className={colorClasses.info.bg}>Info background</div>
 * <div className={colorClasses.success.text}>Success text</div>
 * ```
 */
export const colorClasses = {
  info: {
    bg: "bg-info",
    bgLighter: "bg-info-lighter",
    bgDarker: "bg-info-darker",
    text: "text-info",
    textForeground: "text-info-foreground",
    border: "border-info",
    ring: "ring-info",
  },
  success: {
    bg: "bg-success",
    bgLighter: "bg-success-lighter",
    bgDarker: "bg-success-darker",
    text: "text-success",
    textForeground: "text-success-foreground",
    border: "border-success",
    ring: "ring-success",
  },
  danger: {
    bg: "bg-danger",
    bgLighter: "bg-danger-lighter",
    bgDarker: "bg-danger-darker",
    text: "text-danger",
    textForeground: "text-danger-foreground",
    border: "border-danger",
    ring: "ring-danger",
  },
  warning: {
    bg: "bg-warning",
    bgLighter: "bg-warning-lighter",
    bgDarker: "bg-warning-darker",
    text: "text-warning",
    textForeground: "text-warning-foreground",
    border: "border-warning",
    ring: "ring-warning",
  },
} as const;

/**
 * Fonction utilitaire pour obtenir la variable CSS d'une couleur
 *
 * @example
 * ```tsx
 * const infoColor = getCSSVariable("info", "normal");
 * // Retourne: "var(--info)"
 * ```
 */
export function getCSSVariable(
  colorName: ColorName,
  variant: ColorVariant = "normal",
): string {
  const cssVar = colorTheme[colorName].variants[variant];
  return `var(${cssVar})`;
}

/**
 * Fonction utilitaire pour obtenir la variable CSS de texte (foreground)
 *
 * @example
 * ```tsx
 * const infoForeground = getCSSForeground("info");
 * // Retourne: "var(--info-foreground)"
 * ```
 */
export function getCSSForeground(colorName: ColorName): string {
  return `var(${colorTheme[colorName].variants.foreground})`;
}

/**
 * Guide d'utilisation des couleurs
 */
export const colorUsageGuide = {
  info: [
    "Notifications d'information",
    "Documentation et aide",
    "États en cours de traitement",
    "Liens vers des ressources",
  ],
  success: [
    "Confirmations de succès",
    "Validations de formulaire",
    "Opérations réussies",
    "États actifs/complétés",
  ],
  danger: [
    "Messages d'erreur",
    "Actions destructives (suppression)",
    "États critiques",
    "Avertissements sévères",
  ],
  warning: [
    "Avertissements modérés",
    "Actions nécessitant attention",
    "États temporaires",
    "Précautions à prendre",
  ],
} as const;

/**
 * Exemples d'utilisation dans les composants
 *
 * @example
 * ```tsx
 * // Dans un composant React
 * import { colorClasses } from "~/components/ui/color-theme";
 *
 * // Utilisation simple
 * <div className={colorClasses.info.bg}>
 *   <p className={colorClasses.info.textForeground}>Message d'info</p>
 * </div>
 *
 * // Avec Tailwind
 * <div className="bg-info text-info-foreground p-4 rounded">
 *   Info message
 * </div>
 *
 * // Avec les composants UI
 * <Alert variant="info">Info alert</Alert>
 * <Badge variant="success">Success badge</Badge>
 * <Button variant="danger">Delete</Button>
 * ```
 */
