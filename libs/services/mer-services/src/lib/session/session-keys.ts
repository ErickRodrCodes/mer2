// Llaves usadas en SessionStorage para la sesión
export const SESSION_KEYS = {
  USER_DATA: 'userData',
  // Agrega aquí otras llaves necesarias
} as const;

// Tipo para las llaves permitidas
export type SessionKey = typeof SESSION_KEYS[keyof typeof SESSION_KEYS];
