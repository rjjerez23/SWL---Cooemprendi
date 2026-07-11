const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(
  /\/$/,
  "",
);

const USE_MOCK_AUTH =
  import.meta.env.VITE_USE_MOCK_AUTH === "true";

const MOCK_STORAGE_KEY = "coopemprendi_mock_user";

function esperar(milisegundos) {
  return new Promise((resolve) => {
    setTimeout(resolve, milisegundos);
  });
}

async function leerRespuestaJson(response) {
  const contenido = await response.text();

  if (!contenido) {
    return {};
  }

  try {
    return JSON.parse(contenido);
  } catch {
    throw new Error(
      "El servidor devolvió una respuesta que no es válida.",
    );
  }
}

export async function loginRequest(credenciales) {
  const usuario = credenciales.usuario.trim();
  const clave = credenciales.clave;

  if (USE_MOCK_AUTH) {
    await esperar(500);

    if (usuario !== "admin" || clave !== "1234") {
      throw new Error("Usuario o contraseña incorrectos.");
    }

    const usuarioSimulado = {
      id_usuario: 1,
      nombre: "Administrador General",
      usuario: "admin",
      rol: "administrador",
    };

    sessionStorage.setItem(
      MOCK_STORAGE_KEY,
      JSON.stringify(usuarioSimulado),
    );

    return usuarioSimulado;
  }

  let response;

  try {
    response = await fetch(`${API_URL}/login.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        usuario,
        clave,
      }),
    });
  } catch {
    throw new Error(
      "No fue posible conectar con el servidor.",
    );
  }

  const datos = await leerRespuestaJson(response);

  if (
    !response.ok ||
    datos.success !== true ||
    !datos.usuario
  ) {
    throw new Error(
      datos.message || "No fue posible iniciar sesión.",
    );
  }

  return datos.usuario;
}

export async function getSessionRequest() {
  if (USE_MOCK_AUTH) {
    const usuarioGuardado = sessionStorage.getItem(
      MOCK_STORAGE_KEY,
    );

    if (!usuarioGuardado) {
      return null;
    }

    try {
      return JSON.parse(usuarioGuardado);
    } catch {
      sessionStorage.removeItem(MOCK_STORAGE_KEY);
      return null;
    }
  }

  let response;

  try {
    response = await fetch(`${API_URL}/session.php`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });
  } catch {
    return null;
  }

  if (response.status === 401) {
    return null;
  }

  const datos = await leerRespuestaJson(response);

  if (
    !response.ok ||
    datos.authenticated === false ||
    !datos.usuario
  ) {
    return null;
  }

  return datos.usuario;
}

export async function logoutRequest() {
  if (USE_MOCK_AUTH) {
    await esperar(250);
    sessionStorage.removeItem(MOCK_STORAGE_KEY);
    return;
  }

  const response = await fetch(`${API_URL}/logout.php`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });

  const datos = await leerRespuestaJson(response);

  if (!response.ok || datos.success === false) {
    throw new Error(
      datos.message || "No fue posible cerrar la sesión.",
    );
  }
}