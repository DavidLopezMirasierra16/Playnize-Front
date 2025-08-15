import { useEffect, useState } from "react";
import type { Url } from "../Deportes/Deportes";
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

export function Equipos({ url }: Url) {

    interface Equipo {
        $id: string,
        id: number,
        nombre: string,
        activo: boolean,
        participantes: number,
        torneos: number
    }

    interface Busqueda {
        integrante: string,
        nombre: string,
        torneos: string,
        activo: string
    }

    const { token, rol } = useAuth();
    const { data, loading, error, fetchData } = useFetch();
    const [pagina, setPagina] = useState<number>(1);
    const [visible, setVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const [buscar, setBuscar] = useState<Busqueda>({
        integrante: '',
        nombre: '',
        torneos: '',
        activo: ''
    });

    const [filtro, setFiltros] = useState<Busqueda>({
        integrante: '',
        nombre: '',
        torneos: '',
        activo: ''
    });

    useEffect(() => {
        const params = new URLSearchParams();
        params.append('page', pagina.toString());

        if (buscar.integrante) params.append('integrante', buscar.integrante.toString());
        if (buscar.nombre?.trim()) params.append('nombre', buscar.nombre.trim());
        if (buscar.torneos) params.append('torneos', buscar.torneos.toString());
        if (buscar.activo) params.append('activo', buscar.activo.toString());

        fetchData(url + `?${params}`, 'get', {}, token);
    }, [url, buscar, pagina]);

    const handleVisible = () => {
        setVisible(!visible);
    }

    const handleChangeFiltro = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBuscar(filtro);
    }

    const handleNextPagina = () => {
        setPagina((prevPag: number) => prevPag + 1);
    }

    const hangleBackPagina = () => {
        setPagina((prevPagina: number) => prevPagina - 1);
    }

    const handleLimpiar = () => {
        const filtroLimpio = {
            integrante: '',
            nombre: '',
            torneos: '',
            activo: ''
        }

        setFiltros(filtroLimpio);
        setBuscar(filtroLimpio);
        setPagina(1);
    }

    const handleRedirect = (id: number) => {
        navigate(`/panel/equipos/${id}`);
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
                        <p className="mb-4 font-bold text-lg">{rol == 1 ? "Equipos" : "Tus equipos"}</p>

                        {/* Botón de mostrar filtros */}
                        <div className={`mb-4`}>
                            <button onClick={handleVisible} className="flex flex-wrap gap-1 items-center cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white hover:bg-[#374151]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                                </svg>
                                {!visible ? 'Filtros' : 'Ocultar'}
                            </button>
                        </div>

                        {/* Filtros */}
                        <form onSubmit={handleSubmit}>
                            <div className={`mb-4 grid grid-cols-1 gap-2 text-center sm:text-start sm:grid-cols-2 sm:gap-0 md:grid-cols-3 xl:grid-cols-5 bg-white p-3 rounded-md shadow-sm max-w-6xl ${visible ? 'block' : 'hidden'}`}>
                                <div>
                                    <p className="text-sm text-gray-500">Nombre</p>
                                    <input type="text" name="nombre" id="nombre" value={filtro.nombre} onChange={handleChangeFiltro} className="ps-1 border border-[#868686] rounded-sm" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Nº de integrantes</p>
                                    <input type="number" min="0" name="integrante" id="integrante" value={filtro.integrante} onChange={handleChangeFiltro} className="ps-1 border border-[#868686] rounded-sm" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Nº de torneos</p>
                                    <input type="number" min="0" name="torneos" id="torneos" value={filtro.torneos} onChange={handleChangeFiltro} className="ps-1 border border-[#868686] rounded-sm" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Equipo</p>
                                    <select name="activo" id="activo" value={filtro.activo} className="border border-[#868686] rounded-sm" onChange={handleChangeFiltro}>
                                        <option value="0">Seleccione una opción</option>
                                        <option value="true">Activo</option>
                                        <option value="false">No activo</option>
                                    </select>
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

                        {/* Tabla */}
                        <div>
                            {data.datos.$values != 0 ? (
                                data.datos.$values.map((e: Equipo, i: number) => {
                                    return (
                                        <div key={e.$id} className={`mb-5 items-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ${i === data.datos.$values.length - 1 ? '' : ' border-b-2 border-b-[#F3F4F6]'}`}>
                                            <div>
                                                <p className="text-sm text-gray-500">Equipo</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{e.nombre}</p>
                                            </div>
                                            <div className="mt-2 lg:mt-0">
                                                <p className="text-sm text-gray-500">Nº de integrantes</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{e.participantes}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Nº de torneos</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{e.torneos}</p>
                                            </div>
                                            <div className="mt-2 lg:mt-0">
                                                <p className="text-sm text-gray-500">Estado</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{e.activo == true ? "Activo" : "No activo"}</p>
                                            </div>
                                            <div className="mt-2 lg:mt-0">
                                                <button title="Detalles del equipo" onClick={() => handleRedirect(e.id)} className=" cursor-pointer bg-blue-500 hover:bg-blue-600 p-1 rounded-sm text-white">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : <p>No hay ningún equipo registrado</p>}
                        </div>
                        {data.totalPages > 1 && (
                            <div className="flex flex-wrap items-center">
                                <button className={`cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white me-2 hover:bg-[#374151] ${data.currentPage === data.totalPages ? 'hidden' : ''}`} onClick={handleNextPagina}>Siguiente</button>
                                <button className={`cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white me-2 hover:bg-[#374151] ${data.currentPage === 1 ? 'hidden' : ''}`} onClick={hangleBackPagina}>Atrás</button>
                                <p>{data.currentItems} torneos de {data.totalItems}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </>
    )
}