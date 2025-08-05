import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: number | number[];
}

/**
 * Función que nos va a permitir tener rutas protegidas
 * @param param0 va a ser la pagina que vamos a querer mostrar
 * @returns 
 */
const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { token, rol } = useAuth();

  if (!token) return <Navigate to="/login" replace />; //No token => '/panel'
  if (requiredRole && (Array.isArray(requiredRole) ? !requiredRole.includes(rol ?? -1) : rol !== requiredRole)) {
    return <Navigate to="/panel" replace />; //No permiso => '/panel'
  }

  return <>{children}</>;
};

export default PrivateRoute;