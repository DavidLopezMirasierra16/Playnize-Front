import { useEffect, useState } from "react";
import { Boton } from "../../Componentes_Personalizados/BotonPrincipal";
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import { useAuth } from "../../Auth/AuthContext";

interface DatosRol {
    visible: () => void,
    datosEditar?: Rol,
    id?: number
}

interface Rol {
    rol: string
}

export function RegistrarRol({ visible, datosEditar, id }: DatosRol) {

    const { token, setMensaje } = useAuth();
    const { data, loading, error, fetchData } = useFetch();
    const [rol, setRol] = useState({
        rol: datosEditar?.rol || ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRol({ rol: e.target.value });
    }

    const handleFetch = () => {
        const url = datosEditar ? `http://localhost:5170/api/Roles/${id}` : `http://localhost:5170/api/Roles`;
        const method = datosEditar ? 'put' : 'post';
        fetchData(url, method, { body: rol }, token);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleFetch();
    }

    useEffect(() => {
        if (data) {
            setMensaje(data.message)
            visible();
        }
    }, [data]);

    return (
        <form onSubmit={handleSubmit} className="text-white">
            <div className="fixed inset-0 bg-gray-90 backdrop-blur-xs flex justify-center items-center z-50">
                <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md">

                    {error ? (
                        <div className="absolute inset-0 bg-gray-500 bg-opacity-30 flex justify-center items-center z-10">
                            <div className="bg-white text-red-600 p-6 rounded-xl shadow-lg text-center w-full max-w-sm mx-auto">
                                <p className="font-semibold text-lg">Error</p>
                                <p className="mt-2">{error}</p>
                            </div>
                        </div>
                    ) : loading ? (
                        <div className="absolute inset-0 bg-gray-500 bg-opacity-30 flex justify-center items-center z-10">
                            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : null}

                    <h2 className="text-lg font-semibold mb-4">{!datosEditar ? "Añadir rol" : "Editar rol"}</h2>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm text-white">Nombre</p>
                        <input type="text" name="rol" value={rol.rol} onChange={handleChange} className="border rounded p-1 bg-white text-black" placeholder="Rol" />
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                        <Boton type="button" mensaje="Cerrar" name="crear" accion={visible} colores="bg-red-700 hover:bg-red-600" />
                        <Boton mensaje="Guardar" colores="bg-emerald-600 hover:bg-emerald-700" />
                    </div>
                </div>
            </div>
        </form>
    )
}