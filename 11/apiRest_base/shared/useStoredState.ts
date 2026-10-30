import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

/**
 * useState que se acuerda del valor aunque cierres la app.
 *
 *   const [nombre, setNombre, isReady] = useStoredState("@apiRest:nombre", "");
 *
 * - Al montarse, LEE el valor guardado en el celular (AsyncStorage).
 * - Cada vez que el valor cambia, lo GUARDA.
 * - isReady avisa cuando terminó de leer (leer es asíncrono: tarda un instante).
 */
export function useStoredState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isReady, setIsReady] = useState(false);

  // 1) Leer lo que había guardado (una sola vez)
  useEffect(() => {
    let active = true; // evita actualizar el estado si la pantalla ya se cerró

    const loadValue = async () => {
      try {
        const saved = await AsyncStorage.getItem(key);
        // AsyncStorage solo guarda texto: JSON.parse lo vuelve a su forma original
        if (saved !== null && active) {
          setValue(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Error al leer", key, error);
      } finally {
        if (active) setIsReady(true);
      }
    };

    loadValue();
    return () => {
      active = false;
    };
  }, [key]);

  // 2) Guardar cada vez que cambia (pero solo después de haber leído, para no pisar el valor guardado)
  useEffect(() => {
    if (!isReady) return;
    AsyncStorage.setItem(key, JSON.stringify(value)).catch((error) =>
      console.error("Error al guardar", key, error)
    );
  }, [key, value, isReady]);

  return [value, setValue, isReady] as const;
}
