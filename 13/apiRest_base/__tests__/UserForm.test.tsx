import { UserForm } from "@/features/users/UserForm";
import { fireEvent, render, screen } from "@testing-library/react-native";

// El formulario usa los colores del tema. Para probarlo solo le damos unos colores fijos
// (así no hace falta AsyncStorage ni el ThemeProvider completo).
jest.mock("@/features/theme/ThemeContext", () => {
  const { lightColors } = jest.requireActual("@/features/theme/theme");
  return { useTheme: () => ({ colors: lightColors }) };
});

function renderForm(onSubmit = jest.fn()) {
  render(<UserForm submitLabel="Crear Usuario" loading={false} onSubmit={onSubmit} />);
  return onSubmit;
}

describe("UserForm", () => {
  test("con los campos vacíos muestra errores y NO envía", () => {
    const onSubmit = renderForm();

    fireEvent.press(screen.getByText("Crear Usuario"));

    expect(screen.getByText("El nombre es obligatorio")).toBeTruthy();
    expect(screen.getByText("El email es obligatorio")).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("un email sin formato válido muestra error y NO envía", () => {
    const onSubmit = renderForm();

    fireEvent.changeText(screen.getByPlaceholderText("Juan Pérez"), "Ana");
    fireEvent.changeText(screen.getByPlaceholderText("juanp"), "ana");
    fireEvent.changeText(screen.getByPlaceholderText("juan@mail.com"), "hola");
    fireEvent.press(screen.getByText("Crear Usuario"));

    expect(screen.getByText(/Ingresá un email válido/)).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("con datos válidos envía los datos (sin espacios de más)", () => {
    const onSubmit = renderForm();

    fireEvent.changeText(screen.getByPlaceholderText("Juan Pérez"), "  Ana Pérez  ");
    fireEvent.changeText(screen.getByPlaceholderText("juanp"), "anap");
    fireEvent.changeText(screen.getByPlaceholderText("juan@mail.com"), "ana@mail.com");
    fireEvent.press(screen.getByText("Crear Usuario"));

    expect(onSubmit).toHaveBeenCalledWith({ name: "Ana Pérez", username: "anap", email: "ana@mail.com" });
  });
});
