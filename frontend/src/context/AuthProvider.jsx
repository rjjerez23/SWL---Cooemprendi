import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import AuthContext from "./AuthContext.js";

import {
  getSessionRequest,
  loginRequest,
  logoutRequest,
} from "../services/authService.js";

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] =
    useState(true);

  useEffect(() => {
    let componenteActivo = true;

    async function verificarSesion() {
      try {
        const usuarioEncontrado =
          await getSessionRequest();

        if (componenteActivo) {
          setUsuario(usuarioEncontrado);
        }
      } finally {
        if (componenteActivo) {
          setCargandoSesion(false);
        }
      }
    }

    verificarSesion();

    return () => {
      componenteActivo = false;
    };
  }, []);

  const iniciarSesion = useCallback(
    async (credenciales) => {
      const usuarioAutenticado =
        await loginRequest(credenciales);

      setUsuario(usuarioAutenticado);

      return usuarioAutenticado;
    },
    [],
  );

  const cerrarSesion = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUsuario(null);
    }
  }, []);

  const valorContexto = useMemo(
    () => ({
      usuario,
      autenticado: Boolean(usuario),
      cargandoSesion,
      iniciarSesion,
      cerrarSesion,
    }),
    [
      usuario,
      cargandoSesion,
      iniciarSesion,
      cerrarSesion,
    ],
  );

  return (
    <AuthContext.Provider value={valorContexto}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;