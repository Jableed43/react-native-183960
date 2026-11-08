import { createUser, deleteUser, fetchUsers } from "@/features/users/usersService";

// Un "fetch de mentira": así probamos el servicio SIN servidor y SIN internet.
const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

// Arma una respuesta falsa con el formato mínimo que usa el servicio.
const respuesta = (ok: boolean, status: number, body: unknown = {}) => ({
  ok,
  status,
  json: async () => body,
});

beforeEach(() => mockFetch.mockReset());

describe("usersService", () => {
  test("fetchUsers devuelve la lista cuando el servidor responde bien", async () => {
    mockFetch.mockResolvedValue(respuesta(true, 200, [{ id: 1, name: "Ana" }]));

    const users = await fetchUsers();

    expect(users).toHaveLength(1);
    expect(users[0].name).toBe("Ana");
  });

  test("createUser envía un POST con los datos en el body", async () => {
    mockFetch.mockResolvedValue(respuesta(true, 201, { id: 5 }));
    const datos = { name: "Luis", username: "luis", email: "luis@mail.com" };

    await createUser(datos);

    const [, opciones] = mockFetch.mock.calls[0];
    expect(opciones.method).toBe("POST");
    expect(JSON.parse(opciones.body)).toEqual(datos);
  });

  test("un 404 se convierte en un mensaje claro (fetch NO falla solo con un 404)", async () => {
    mockFetch.mockResolvedValue(respuesta(false, 404));

    await expect(deleteUser(999)).rejects.toThrow("No se encontró");
  });

  test("un 500 se convierte en un mensaje claro", async () => {
    mockFetch.mockResolvedValue(respuesta(false, 500));

    await expect(fetchUsers()).rejects.toThrow("El servidor tuvo un problema");
  });

  test("si no hay conexión, avisa que no se pudo conectar", async () => {
    mockFetch.mockRejectedValue(new TypeError("Network request failed"));

    await expect(fetchUsers()).rejects.toThrow("No se pudo conectar");
  });
});
