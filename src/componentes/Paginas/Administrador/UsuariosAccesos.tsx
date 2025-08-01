import { useEffect } from "react";
import { useFetch } from "../../Hooks_Personalizados/UseFetch"
import { useAuth } from "../../Auth/AuthContext";
import { Activo } from "../Estados";
import { useNavigate } from "react-router-dom";
import type { Url } from "./Deportes";

interface User {
    $id: string,
    id: number,
    idUsuario: number,
    nombre: string,
    apellidos: string
}

/**Listado con los usuarios logeados */
export function UsuariosAccesos({ url }: Url) {
    const { token } = useAuth();
    const navegate = useNavigate();
    const { data, loading, error, fetchData } = useFetch();

    useEffect(() => {
        fetchData(url, 'get', {}, token);
    }, [url]);

    const handleEdit = (id: number) => {
        navegate(`/panel/usuarios/${id}`);
    }

    return (
        <>
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

            {data && (
                <div>
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <p className="mb-4 font-bold text-lg">Usuarios conectados</p>

                        {/* Aquí irán los filtros */}

                        <div>
                            {data.datos.$values != 0 ? (
                                data.datos.$values.map((u: User, i: number) => {
                                    return (
                                        <div key={u.$id} className={`mb-5 items-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ${i === data.datos.$values.length - 1 ? '' : ' border-b-2 border-b-[#F3F4F6]'}`}>
                                            <div>
                                                <p className="text-sm text-gray-500">Nombre</p>
                                                <p className="text-base font-medium text-gray-800 break-words truncate">{u.nombre}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Apellidos</p>
                                                <p className="text-base font-medium text-gray-800 break-words truncate">{u.apellidos}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mt-3 md:mt-0">Sesión</p>
                                                <Activo />
                                            </div>
                                            <div className="text-center">
                                                <button onClick={() => handleEdit(u.idUsuario)} title="Detalles del usuario" className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : <p>No hay usuarios conectados</p>}
                        </div>

                    </div>
                </div>
            )}

        </>
    )

}