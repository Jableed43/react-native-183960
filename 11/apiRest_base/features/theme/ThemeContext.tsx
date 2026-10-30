import { Colors, darkColors, lightColors } from "@/features/theme/theme";
import { useStoredState } from "@/shared/useStoredState";
import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  colors: Colors;
  toggleTheme: () => void;
}

// undefined = "nadie me proveyó": lo usamos para detectar el error en useTheme.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Antes: useState("light"). Ahora el tema se guarda en el celular y se recuerda al reabrir la app.
  const [theme, setTheme, isReady] = useStoredState<Theme>("@apiRest:theme", "light");

  // useCallback (Clase 6): toggleTheme mantiene la misma identidad entre renders.
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // useMemo (Clase 6): sin esto, "value" es un objeto nuevo en cada render del Provider
  // y TODOS los consumidores se re-renderizan aunque el tema no haya cambiado.
  const value = useMemo(
    () => ({ theme, colors: theme === "light" ? lightColors : darkColors, toggleTheme }),
    [theme, toggleTheme]
  );

  // Mientras se lee el tema guardado no dibujamos nada (dura un instante) para evitar un parpadeo claro -> oscuro.
  if (!isReady) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Hook propio (composición lógica otra vez): los componentes no conocen useContext ni ThemeContext.
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme debe usarse dentro de un <ThemeProvider>");
  }
  return context;
}
