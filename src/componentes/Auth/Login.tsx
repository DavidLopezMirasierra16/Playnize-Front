import { useEffect, useState } from "react"
import { useFetch } from "../Hooks_Personalizados/UseFetch";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

interface Data {
    email: string,
    password: string
}

export function Login() {

    const [datos, setDatos] = useState<Data>({
        email: "",
        password: ""
    });
    
    const { data, loading, error, setError, fetchData } = useFetch();
    const { login, token } = useAuth();
    const navigate = useNavigate();

    const handleDatos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = e.target.id;
        const valor = e.target.value;
        setDatos({ ...datos, [id]: valor });
        setError(null);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchData(`http://localhost:5170/api/Acceso/Login`, 'post', {
            body: {
                Correo: datos.email,
                Clave: datos.password
            }
        });
    }

    //Para guardar el token
    useEffect(() => {
        if (data && data.isSuccess) {
            login(data.token, data.rol);
        }
    }, [data]);

    //Para regirigirnos
    useEffect(() => {
        if (token) {
            navigate('/panel');
        }
    }, [token]);

    return (
        <>
            {loading && (<div className="fixed inset-0 bg-gray-500 bg-opacity-30 flex justify-center items-center z-50">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>)}

            <div className="bg-gray-100">
                <div className="ocultar-scroll min-h-screen flex items-center justify-center fade-in">

                    <a href="/">
                        <img src="/imagenes/Playnize-LOGO.png" alt="Playnize logo" className="w-110 hidden xl:block" />
                    </a>

                    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-800 text-center">Iniciar Sesión</h2>
                        <div className="flex flex-col">
                            <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={datos.email}
                                onChange={handleDatos}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="tucorreo@example.com"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={datos.password}
                                onChange={handleDatos}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-center">
                            <button type="submit" className="mi-button">
                                Enviar
                            </button>
                        </div>

                        <div className="flex flex-wrap justify-center">
                            <p className="mr-2">¿No tienes cuenta?</p>
                            <a href="/registro">Registrese aquí</a>
                        </div>
                        {error && <p className="text-center text-red-500">{error}</p>}

                    </form>
                </div>
            </div>
        </>
    )
}