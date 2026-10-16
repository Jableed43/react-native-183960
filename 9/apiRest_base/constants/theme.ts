// Paleta por función, no por color: "primary", "background", "error"...
// Un objeto por tema. Los dos tienen EXACTAMENTE las mismas claves.
export const lightColors = {
  // Fondos
  background: "#FFFFFF",
  surface: "#F5F5F5",
  card: "#FFFFFF",

  // Textos
  text: "#333333",
  textSecondary: "#666666",
  textDisabled: "#999999",

  // Acciones y estados
  primary: "#007AFF",
  success: "#28A745",
  successDisabled: "#94D3A2",
  error: "#FF3B30",
  onPrimary: "#FFFFFF", // texto sobre botones de color

  // Bordes e inputs
  border: "#E0E0E0",
  inputBackground: "#F5F5F5",
  inputBorder: "#DDDDDD",
  inputText: "#333333",
};

// "Colors" = la forma que tiene que cumplir cualquier tema.
// Si falta una clave en darkColors, TypeScript avisa al instante.
export type Colors = typeof lightColors;

export const darkColors: Colors = {
  background: "#000000",
  surface: "#1C1C1E",
  card: "#2C2C2E",

  text: "#FFFFFF",
  textSecondary: "#EBEBF5",
  textDisabled: "#8E8E93",

  primary: "#0A84FF",
  success: "#32D74B",
  successDisabled: "#1E5A2B",
  error: "#FF453A",
  onPrimary: "#FFFFFF",

  border: "#38383A",
  inputBackground: "#1C1C1E",
  inputBorder: "#38383A",
  inputText: "#FFFFFF",
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
