import { useEffect, useState } from "react";
import { useFetch } from "../../Hooks_Personalizados/UseFetch"
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { RegistrarDeporte } from "../../Componentes_Personalizados/FromRegistrarDeporte";

export interface Url {
    url: string
}

interface Deporte {
    $id: string,
    id: number,
    deporte: string,
    colectivo: string,
    minimoPorEquipo: number,
    maximoPorEquipo: number,
    torneos: number
}

interface Busqueda {
    deporte: string,
    colectivo: string,
    minimoPorEquipo: string,
    maximoPorEquipo: string,
}

export function Deportes({ url }: Url) {

    const { token } = useAuth();
    const navegate = useNavigate();
    const { data, loading, error, fetchData } = useFetch();
    const [pagina, setPagina] = useState<number>(1);
    const [visible, setVisible] = useState<boolean>(false);
    const [visibleForm, setVisibleForm] = useState<boolean>(false);
    const [buscar, setBuscar] = useState<Busqueda>({
        deporte: '',
        colectivo: '',
        minimoPorEquipo: '',
        maximoPorEquipo: ''
    });

    const [filtro, setFiltros] = useState<Busqueda>({
        deporte: '',
        colectivo: '',
        minimoPorEquipo: '',
        maximoPorEquipo: ''
    });

    useEffect(() => {
        const params = new URLSearchParams();
        params.append('page', pagina.toString());

        if (buscar.deporte?.trim()) params.append('deporte', buscar.deporte.trim());
        if (buscar.colectivo) params.append('colectivo', buscar.colectivo.toString());
        if (buscar.minimoPorEquipo) params.append('minimo', buscar.minimoPorEquipo.trim());
        if (buscar.maximoPorEquipo) params.append('maximo', buscar.maximoPorEquipo.trim());

        fetchData(url + `?${params.toString()}`, 'get', {}, token);
    }, [pagina, url, buscar]);

    const handleVisible = () => {
        setVisible(!visible);
    }

    const handleChangeFiltro = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value })) //A los filtros que ya hay, le añade lo nuevo que escribamos
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
            deporte: '',
            colectivo: '',
            minimoPorEquipo: '',
            maximoPorEquipo: ''
        }

        setFiltros(filtroLimpio);
        setBuscar(filtroLimpio);
        setPagina(1);
    }

    const handleRedirect = (id: number) => {
        navegate(`/panel/deportes/${id}`)
    }

    const handleVisibleForm = () => {
        setVisibleForm(!visibleForm);
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
                        <p className="mb-4 font-bold text-lg">Deportes</p>

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
                                <button onClick={handleVisibleForm} className="flex flex-wrap gap-1 items-center cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white hover:bg-[#374151]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <span>Registrar</span>
                                </button>
                            </div>
                        </div>

                        {visibleForm && <RegistrarDeporte visible={handleVisibleForm} />}

                        {/* Filtros */}
                        <form onSubmit={handleSubmit}>
                            <div className={`mb-4 grid grid-cols-1 gap-2 text-center sm:text-start sm:grid-cols-2 sm:gap-0 md:grid-cols-3 xl:grid-cols-5 bg-white p-3 rounded-md shadow-sm max-w-6xl ${visible ? 'block' : 'hidden'}`}>
                                <div>
                                    <p className="text-sm text-gray-500">Deporte</p>
                                    <input type="text" name="deporte" id="deporte" value={filtro.deporte} onChange={handleChangeFiltro} className="border border-[#868686] rounded-sm" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Equipo</p>
                                    <select name="colectivo" id="colectivo" value={filtro.colectivo} className="border border-[#868686] rounded-sm" onChange={handleChangeFiltro}>
                                        <option value="0">Seleccione una opción</option>
                                        <option value="true">Colectivo</option>
                                        <option value="false">Individual</option>
                                    </select>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Participantes minimos</p>
                                    <input type="text" name="minimoPorEquipo" id="minimoPorEquipo" value={filtro.minimoPorEquipo} onChange={handleChangeFiltro} className="border border-[#868686] rounded-sm" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Participantes máximos</p>
                                    <input type="text" name="maximoPorEquipo" id="maximoPorEquipo" value={filtro.maximoPorEquipo} onChange={handleChangeFiltro} className="border border-[#868686] rounded-sm" />
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
                                data.datos.$values.map((d: Deporte, i: number) => {
                                    return (
                                        <div key={d.$id} className={`mb-5 items-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 ${i === data.datos.$values.length - 1 ? '' : ' border-b-2 border-b-[#F3F4F6]'}`}>
                                            <div>
                                                <p className="text-sm text-gray-500">Deporte</p>
                                                <p className="text-base font-medium text-gray-800 break-words truncate">{d.deporte}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Colectivo</p>
                                                <p className="text-base font-medium text-gray-800 break-words truncate">{d.colectivo == '1' ? "Colectivo" : "Individual"}</p>
                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                <p className="text-sm text-gray-500">Jugadores mínimos</p>
                                                <p className="text-base font-medium text-gray-800 break-words truncate">{d.minimoPorEquipo}</p>
                                            </div>
                                            <div className="mt-2 lg:mt-0">
                                                <p className="text-sm text-gray-500">Jugadores máximos</p>
                                                <p className="text-base font-medium text-gray-800 break-words truncate">{d.maximoPorEquipo}</p>
                                            </div>
                                            <div className="mt-2 lg:mt-0">
                                                <p className="text-sm text-gray-500">Nº de torneos</p>
                                                <p className="text-base font-medium text-gray-800 break-words truncate">{d.torneos}</p>
                                            </div>
                                            <div>
                                                <button title="Editar deporte" onClick={() => handleRedirect(d.id)} className=" cursor-pointer bg-[#ff9900] p-1 rounded-sm text-white hover:bg-[#ffbc58]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : <p>No hay ningún deporte registrado</p>}
                        </div>
                        {data.totalPages > 1 && (
                            <div className="flex flex-wrap items-center">
                                <button className={`cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white me-2 hover:bg-[#374151] ${data.currentPage === data.totalPages ? 'hidden' : ''}`} onClick={handleNextPagina}>Siguiente</button>
                                <button className={`cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white me-2 hover:bg-[#374151] ${data.currentPage === 1 ? 'hidden' : ''}`} onClick={hangleBackPagina}>Atrás</button>
                                <p>{data.currentItems} deportes de {data.totalItems}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </>
    )
}