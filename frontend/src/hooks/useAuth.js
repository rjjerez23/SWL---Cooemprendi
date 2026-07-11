import { useContext } from "react";
import AuthContext from "../context/AuthContext.js";

function useAuth() {
  const contexto = useContext(AuthContext);

  if (contexto === undefined) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider.",
    );
  }

  return contexto;
}

export default useAuth;