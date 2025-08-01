import { useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { useNavigate } from "react-router-dom"
import { useFetch } from "../Hooks_Personalizados/UseFetch";

interface Data {
    nombre: string,
    apellidos: string,
    email: string,
    telefono: string,
    clave: string,
    rol: string
}

export function Register() {

    const navigate = useNavigate();
    const { token } = useAuth()
    const { data, loading, error, fetchData } = useFetch();

    const [datos, setDatos] = useState<Data>({
        nombre: "",
        apellidos: "",
        email: "",
        telefono: "",
        clave: "",
        rol: ""
    });

    const handleDatos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const info = e.target.id;
        const info_data = e.target.value;
        setDatos({ ...datos, [info]: info_data });
    }

    const handleRol = (e: React.MouseEvent<HTMLInputElement>) => {
        const rolElegido = e.currentTarget.value;
        setDatos({ ...datos, rol: rolElegido === "Organizador" ? "2" : "3" });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchData(`http://localhost:5170/api/Acceso/Registrarse`, 'post', {
            body: datos
        });
    }

    useEffect(() => {
        if (data && data.isSuccess) {
            navigate("/login");
        }
    }, [data]);

    useEffect(() => {
        if (token) {
            navigate("/");
        }
    }, [token])

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 fade-in">
                <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center">Registrarse</h2>
                    <div className="flex flex-col">
                        <label htmlFor="nombre" className="mb-1 text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            onChange={handleDatos}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="apellidos" className="mb-1 text-sm font-medium text-gray-700">
                            Apellidos
                        </label>
                        <input
                            type="text"
                            id="apellidos"
                            onChange={handleDatos}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            onChange={handleDatos}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            placeholder="tucorreo@example.com"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="telefono" className="mb-1 text-sm font-medium text-gray-700">
                            Telefono
                        </label>
                        <input
                            type="number"
                            id="telefono"
                            onChange={handleDatos}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="clave"
                            onChange={handleDatos}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            placeholder="********"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">
                            Acciones
                        </label>
                        <div className="flex flex-wrap justify-center gap-5 text-center">
                            <div className="w-5/12">
                                <input type="button" value="Organizador" onClick={handleRol} className={`px-3 py-1 border rounded-lg cursor-pointer transition ${datos.rol === "2" ? "bg-emerald-500 text-white" : "bg-gray-200"}`} />
                            </div>
                            <div className="w-5/12">
                                <input type="button" value="Participante" onClick={handleRol} className={`px-3 py-1 border rounded-lg cursor-pointer transition ${datos.rol === "3" ? "bg-emerald-500 text-white" : "bg-gray-200"}`} />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center mt-6">
                        <button type="submit" className="mi-button">
                            Enviar
                        </button>
                    </div>
                    <div className="flex flex-wrap justify-center">
                        <p className="mr-2">¿Tienes cuenta?</p>
                        <a href="/login">Inicie sesión</a>
                    </div>

                    {error && <p className="text-red-500 text-center">{error}</p>}
                
                </form>
            </div>
        </>
    )
}