import { useEffect, useState } from "react";
import { useFetch } from "../../Hooks_Personalizados/UseFetch"
import { useAuth } from "../../Auth/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import type { Url } from "./Deportes";
import { Boton } from "../../Componentes_Personalizados/BotonPrincipal";

/**
 * Listado con todos los usuarios, le pasamos la url de la petición y listo.
 * Los datos que tiene que devolver la peticion son:
 * Id, nombre, apellidos, email, teléfono
 */
export function UsuariosListado({ url }: Url) {

    interface Datos {
        $id: string,
        id: number,
        nombre: string,
        apellidos: string,
        email: string,
        telefono: string
    }

    const location = useLocation();
    const { data, loading, error, fetchData } = useFetch();
    const { token, mensaje } = useAuth();
    const navegate = useNavigate();
    const [pagina, setPagina] = useState<number>(1);
    const [visible, setVisible] = useState<boolean>(false);
    const [buscar, setBuscar] = useState<{ nombre: string, apellidos: string, telefono: string, email: string }>({
        nombre: '',
        apellidos: '',
        telefono: '',
        email: ''
    });

    const [filtros, setFiltros] = useState({
        nombre: '',
        apellidos: '',
        telefono: '',
        email: ''
    });

    useEffect(() => {
        const params = new URLSearchParams();
        params.append('page', pagina.toString());

        if (buscar.nombre?.trim()) params.append('nombre', buscar.nombre.trim());
        if (buscar.apellidos?.trim()) params.append('apellidos', buscar.apellidos.trim());
        if (buscar.telefono?.trim()) params.append('telefono', buscar.telefono.trim());
        if (buscar.email?.trim()) params.append('email', buscar.email.trim());

        fetchData(url + `${params.toString()}`, 'get', {}, token);
    }, [pagina, buscar, url]);

    const handleChangeFiltro = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBuscar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBuscar(filtros);
        setPagina(1);
    }

    const handleLimpiar = () => {
        const filtroLimpio = {
            nombre: '',
            apellidos: '',
            telefono: '',
            email: ''
        };

        setFiltros(filtroLimpio);
        setBuscar(filtroLimpio);
        setPagina(1);
    }

    const handleVisible = () => {
        setVisible(!visible);
    }

    const handleNextPagina = () => {
        setPagina((prevPag: number) => prevPag + 1);
    }

    const hangleBackPagina = () => {
        setPagina((prevPagina: number) => prevPagina - 1);
    }

    const handleEdit = (id: number) => {
        navegate(`/panel/usuarios/${id}`);
    }

    const handleRegistro = () => {
        navegate(`/panel/usuarios/registro`);
    }

    useEffect(() => {
        if (mensaje != null) {
            console.log(mensaje);
        }
    }, [mensaje]);

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

            {mensaje && (
                <div className="bg-gradient-to-l from-lime-500 via-green-500 to-emerald-500 rounded-md p-2 mb-4">
                    <p className="text-white">{mensaje}</p>
                </div>
            )}

            {data && (
                <div>
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <p className="mb-4 font-bold text-lg">{location.pathname == '/panel/usuarios/listado' ? "Usuarios" : "Administradores"}</p>

                        {/* Botón de mostrar filtros */}
                        <div className="flex flex-wrap gap-2">
                            <div className={`mb-4`}>
                                <button onClick={handleVisible} className="flex flex-wrap gap-1 items-center cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white hover:bg-[#374151]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                                    </svg>
                                    {!visible ? 'Filtros' : 'Ocultar'}
                                </button>
                            </div>
                            <div className={`mb-4`}>
                                <button onClick={handleRegistro} className="flex flex-wrap gap-1 items-center cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white hover:bg-[#374151]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                    </svg>
                                    Registrar
                                </button>
                            </div>
                        </div>

                        {/* Filtros */}
                        <form onSubmit={handleBuscar}>
                            <div className={`mb-4 grid grid-cols-1 gap-2 text-center sm:text-start sm:grid-cols-2 sm:gap-0 md:grid-cols-3 xl:grid-cols-5 bg-white p-3 rounded-md shadow-sm max-w-6xl ${visible ? 'block' : 'hidden'}`}>
                                <div>
                                    <p className="text-sm text-gray-500">Nombre</p>
                                    <input type="text" name="nombre" id="nombre" value={filtros.nombre} onChange={handleChangeFiltro} className="border border-[#868686] rounded-sm" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Apellidos</p>
                                    <input type="text" name="apellidos" id="apellidos" value={filtros.apellidos} onChange={handleChangeFiltro} className="border border-[#868686] rounded-sm" />
                                </div>
                                <div className="mt-2 md:mt-0">
                                    <p className="text-sm text-gray-500">Teléfono</p>
                                    <input type="text" name="telefono" id="telefono" value={filtros.telefono} onChange={handleChangeFiltro} className="border border-[#868686] rounded-sm" />
                                </div>
                                <div className="mt-2 xl:mt-0">
                                    <p className="text-sm text-gray-500">Email</p>
                                    <input type="text" name="email" id="email" value={filtros.email} onChange={handleChangeFiltro} className="border border-[#868686] rounded-sm" />
                                </div>
                                <div className="mt-3 flex gap-2 items-end w-4/4">
                                    <button type="submit" className="w-12/12 cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white hover:bg-[#374151]">
                                        Buscar
                                    </button>
                                    <button type="button" onClick={handleLimpiar} className="w-12/12 cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white hover:bg-[#374151]">
                                        Limpiar
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div>
                            {data.datos.$values != 0 ? (
                                data.datos.$values.map((u: Datos, i: number) => {
                                    return (
                                        <div key={u.$id} className={`mb-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ${i === data.datos.$values.length - 1 ? '' : ' border-b-2 border-b-[#F3F4F6]'}`}>
                                            <div>
                                                <p className="text-sm text-gray-500">Nombre</p>
                                                <p className="text-base font-medium text-gray-800 break-words truncate">{u.nombre}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Apellidos</p>
                                                <p className="text-base font-medium text-gray-800 break-words truncate">{u.apellidos}</p>
                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                <p className="text-sm text-gray-500">Teléfono</p>
                                                <p className="text-base font-medium text-gray-800 break-words truncate">{u.telefono}</p>
                                            </div>
                                            <div className="mt-2 lg:mt-0">
                                                <p className="text-sm text-gray-500">Email</p>
                                                <a href={`mailto:${u.email}`} className="text-base font-medium text-gray-800 break-words truncate">{u.email}</a>
                                            </div>
                                            <div className="mb-2 flex flex-wrap lg:items-center lg:justify-center mt-2 lg:mt-0 lg:mb-0">
                                                <button onClick={() => handleEdit(u.id)} title="Detalles del usuario" className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <button title="Eliminar usuario" className="cursor-pointer bg-red-500 hover:bg-red-600 text-white p-1 rounded-sm ms-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                        <path d="M10.375 2.25a4.125 4.125 0 1 0 0 8.25 4.125 4.125 0 0 0 0-8.25ZM10.375 12a7.125 7.125 0 0 0-7.124 7.247.75.75 0 0 0 .363.63 13.067 13.067 0 0 0 6.761 1.873c2.472 0 4.786-.684 6.76-1.873a.75.75 0 0 0 .364-.63l.001-.12v-.002A7.125 7.125 0 0 0 10.375 12ZM16 9.75a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : <p>{location.pathname == '/panel/usuarios/listado' ? "No hay participantes " : "No hay organizadores "}con esos datos almacenados</p>}
                            {data.totalPages > 1 && (
                                <div className="flex flex-wrap items-center">
                                    <button className={`cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white me-2 hover:bg-[#374151] ${data.currentPage === data.totalPages ? 'hidden' : ''}`} onClick={handleNextPagina}>Siguiente</button>
                                    <button className={`cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white me-2 hover:bg-[#374151] ${data.currentPage === 1 ? 'hidden' : ''}`} onClick={hangleBackPagina}>Atrás</button>
                                    <p>{data.currentItems} usuarios de {data.totalItems}</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}