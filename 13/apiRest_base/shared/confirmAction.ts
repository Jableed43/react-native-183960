import { Alert, Platform } from "react-native";

/**
 * Pide confirmación antes de una acción que no se puede deshacer (por ejemplo, borrar).
 * En el celular usa el cartel nativo (Alert); en el navegador, window.confirm
 * (porque Alert.alert no hace nada en la web).
 */
export function confirmAction(title: string, message: string, onConfirm: () => void, confirmText = "Eliminar") {
  if (Platform.OS === "web") {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }

  Alert.alert(title, message, [
    { text: "Cancelar", style: "cancel" },
    { text: confirmText, style: "destructive", onPress: onConfirm },
  ]);
}
