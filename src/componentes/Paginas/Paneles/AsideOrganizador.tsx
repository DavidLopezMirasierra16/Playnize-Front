import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";

export function AsideOrganizador({ onClose }: { onClose?: () => void }) {
    const { logout } = useAuth();

    const handleLogOut = () => {
        logout();
    }

    return (
        <>
            <Link to={"/panel/perfil"} onClick={onClose} style={{ color: "white" }} className="text-start font-bold">Perfil</Link>
            <button onClick={handleLogOut} className="cursor-pointer text-start">Cerrar Sesión</button>
        </>
    )
}