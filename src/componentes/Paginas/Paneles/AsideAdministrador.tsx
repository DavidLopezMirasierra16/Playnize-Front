import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext"
import { useState } from "react";

export function AsideAdmin({ onClose }: { onClose?: () => void }) {
    const { logout } = useAuth();
    const [submenuOpen, setSubmenuOpen] = useState<boolean>(false);

    const handleLogOut = () => {
        logout();
    }

    return (
        <>
            <div
                className="relative group"
                onMouseEnter={() => setSubmenuOpen(true)}
                onMouseLeave={() => setSubmenuOpen(false)}
            >
                <div className="text-white text-start font-bold cursor-pointer">
                    Usuarios
                </div>
                {submenuOpen && (
                    <div className="absolute left-full top-0 mt-0 ml-0 w-40 bg-gray-700 text-white shadow-lg rounded p-2 z-40 space-y-2">
                        <Link to="/panel/usuarios/listado" onClick={onClose} className="block hover:underline" style={{ color: "white" }}>
                            Clientes
                        </Link>
                        <Link to="/panel/usuarios/empleados" onClick={onClose} className="block hover:underline" style={{ color: "white" }}>
                            Administradores
                        </Link>
                        <Link to="/panel/usuarios/accesos" onClick={onClose} className="block hover:underline" style={{ color: "white" }}>
                            Accesos
                        </Link>
                    </div>
                )}
            </div>
            <Link to={"/panel/deportes"} onClick={onClose} style={{ color: "white" }} className="text-start font-bold">Deportes</Link>
            <Link to={"/panel/torneos"} onClick={onClose} style={{ color: "white" }} className="text-start font-bold">Torneos</Link>
            <Link to={"/panel/equipos"} onClick={onClose} style={{ color: "white" }} className="text-start font-bold">Equipos</Link>
            <Link to={"/panel/roles"} onClick={onClose} style={{ color: "white" }} className="text-start font-bold">Roles</Link>
            <Link to={"/panel/perfil"} onClick={onClose} style={{ color: "white" }} className="text-start font-bold">Perfil</Link>
            <button onClick={handleLogOut} className="cursor-pointer text-start">Cerrar Sesión</button>
        </>
    )
}