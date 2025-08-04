import { useNavigate } from "react-router-dom";

export function NotFound() {
    const navigate = useNavigate();

    const volverAtras = () => {
        navigate(-1); //Esto te lleva a la página anterior del historial
    };

    return (
        <div className="flex items-center justify-center bg-gray-100 min-h-[60vh]">
            <div className="text-center px-6 py-12 bg-white rounded-2xl shadow-md max-w-md">
                <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
                <p className="text-lg text-gray-600 mb-6">Página no encontrada</p>
                <p className="text-sm text-gray-500 mb-8">
                    Lo sentimos, no hemos podido encontrar lo que buscas.
                </p>
                <button
                    onClick={volverAtras}
                    className="cursor-pointer inline-block bg-gray-800 hover:bg-gray-900 text-sm font-medium px-5 py-2 rounded-md transition"
                    style={{ color: "white" }}
                >
                    Volver
                </button>
            </div>
        </div>
    );
}