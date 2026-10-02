export const lightColors = {
    // fondos
    background: "#FFFFFF",
    surface: "#f5f5f5",
    card: "#FFFFFF",

    // textos
    text: "#333333",
    textSecondary: "#666666",
    textDisabled: "#999999",

    // acciones y estados
    primary: "#007AFF",
    success: "#28A745",
    successDisabled: "#94D3A2",
    error: "#FF3B30",
    onPrimary: "#FFFFFF", // texto sobre botones de color

    // bordes e inputs
    border: "#E0E0E0",
    inputBackground: "#F5F5F5",
    inputBorder: "#DDDDDD",
    inputText: "#333333",
}

// con Colors estoy estableciendo lo que tiene que cumplir cualquier tema
// si falta una clave en un tema nuevo typescript te lo avisa
export type Colors = typeof lightColors;

export const darkColors: Colors = {
    // fondos
    background: "#000000",
    surface: "#1C1C1E",
    card: "#2C2C2E",

    // textos
    text: "#FFFFFF",
    textSecondary: "#EBEBF5",
    textDisabled: "#8E8E93",

    // acciones y estados
    primary: "#0A84FF",
    success: "#32D74B",
    successDisabled: "#1E5A2B",
    error: "#FF453A",
    onPrimary: "#FFFFFF",

    // bordes e inputs
    border: "#38383A",
    inputBackground: "#1C1C1E",
    inputBorder: "#38383A",
    inputText: "#FFFFFF",
}

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };