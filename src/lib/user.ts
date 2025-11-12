import defaultAvatar from "~/assets/potato-5.png";

/**
 * Retourne l'avatar de l'utilisateur ou l'avatar par défaut si aucune image n'est fournie
 * @param image - L'URL de l'image de l'utilisateur (peut être null)
 * @returns L'URL de l'image à utiliser
 */
export function getUserAvatar(image: string | null | undefined): string {
  return image || defaultAvatar;
}

/**
 * Retourne l'email de l'utilisateur ou une valeur par défaut si aucun email n'est fourni
 * @param email - L'email de l'utilisateur (peut être null)
 * @param fallback - La valeur par défaut à retourner si l'email est null (par défaut: "Pas d'email")
 * @returns L'email à afficher
 */
export function getUserEmail(
  email: string | null | undefined,
  fallback: string = "Pas d'email",
): string {
  return email || fallback;
}
