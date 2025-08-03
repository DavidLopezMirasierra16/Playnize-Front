import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

export function Header() {
    const location = useLocation();
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const activo = (path: string) => location.pathname === path;

    const handleLogOut = () => {
        logout();
        navigate("/");
    }

    return (
        <header className="p-3 grid lg:grid-cols-[1fr_4fr] items-center ocultar-scroll fade-in">
            {/* Logo */}
            <div className="text-center w-5/12 m-auto md:w-4/12 lg:w-9/12 lg:m-0">
                <a href="/">
                    <img src="/imagenes/Playnize.png" alt="Playnize logo" />
                </a>
            </div>

            {/* Navegación */}
            <div className="sm:mt-3">
                <nav className="grid grid-cols-1 text-center sm:m-auto sm:gap-3 lg:flex lg:justify-end lg:gap-4 lg:items-center">
                    <Link to="/" className={`hover:underline ${activo("/") ? "negrita" : ""}`}>Home</Link>
                    <Link to="/nosotros" className={`hover:underline ${activo("/nosotros") ? "negrita" : ""}`}>Nosotros</Link>
                    <Link to="/historia" className={`hover:underline ${activo("/historia") ? "negrita" : ""}`}>Historia</Link>
                    {
                        token ?
                            (
                                <>
                                    <Link to="/panel" className={`hover:underline ${activo("/panel") ? "negrita" : ""}`}>Tu panel</Link>
                                    {/* <button onClick={handleLogOut} className="cursor-pointer bg-gray-800 text-white p-1 rounded-lg hover:bg-gray-700 transition duration-200" style={{ color: "white" }}>Cerrar Sesión</button> */}
                                </>
                            ) : <Link to="/login" className="hover:underline">
                                <button className="cursor-pointer bg-gray-800 text-white px-2 py-1 rounded-lg hover:bg-gray-700 transition duration-200" style={{ color: "white" }}>
                                    Inicio de Sesión
                                </button>
                            </Link>
                    }
                </nav>
            </div>
        </header>
    );
}
