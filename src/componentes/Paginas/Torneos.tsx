import { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { useFetch } from "../Hooks_Personalizados/UseFetch";
import type { Url } from "./Administrador/Deportes";
import { useNavigate } from "react-router-dom";

export function Torneos({ url }: Url) {

    interface Deporte {
        $id: string,
        deporte: string
    }

    interface Organizador {
        $id: string,
        id: number,
        email: string
    }

    interface Torneo {
        $id: string,
        id: number,
        nombre: string,
        premio: string,
        fechaInicio: string,
        fechaFin: string,
        localizacion: string,
        deporte: Deporte,
        organizador: Organizador
    }

    interface Busqueda {
        nombre: string,
        premio: string,
        fechaInicio: string,
        fechaFin: string,
        localizacion: string,
        deporte: string,
    }

    const { token, rol } = useAuth();
    const { data, loading, error, fetchData } = useFetch();
    const [pagina, setPagina] = useState<number>(1);
    const [visible, setVisible] = useState<boolean>(false);
    const navegate = useNavigate();
    const [buscar, setBuscar] = useState<Busqueda>({
        nombre: '',
        premio: '',
        fechaInicio: '',
        fechaFin: '',
        localizacion: '',
        deporte: ''
    });

    const [filtro, setFiltros] = useState<Busqueda>({
        nombre: '',
        premio: '',
        fechaInicio: '',
        fechaFin: '',
        localizacion: '',
        deporte: ''
    });

    useEffect(() => {
        const params = new URLSearchParams();
        params.append('page', pagina.toString());

        if (buscar.nombre?.trim()) params.append('nombre', buscar.nombre.trim());
        if (buscar.premio) params.append('premio', buscar.premio.toString());
        if (buscar.fechaInicio) params.append('fecha_ini', buscar.fechaInicio.trim());
        if (buscar.fechaFin) params.append('fecha_fin', buscar.fechaFin.toString());
        if (buscar.deporte?.trim()) params.append('deporte', buscar.deporte.trim());
        if (buscar.localizacion?.trim()) params.append('localizacion', buscar.localizacion.trim());

        fetchData(url + `?${params.toString()}`, 'get', {}, token);
    }, [url, pagina, buscar]);

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
            nombre: '',
            premio: '',
            fechaInicio: '',
            fechaFin: '',
            localizacion: '',
            deporte: ''
        }

        setFiltros(filtroLimpio);
        setBuscar(filtroLimpio);
        setPagina(1);
    }

    const handleRedirect = (id: number) => {
        navegate(`/panel/torneos/${id}`)
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
                        <p className="mb-4 font-bold text-lg">{rol == 1 ? "Torneos" : "Tus torneos"}</p>

                        {/* Botón de mostrar filtros */}
                        <div className={`mb-4`}>
                            <button onClick={handleVisible} className="flex flex-wrap items-center cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white hover:bg-[#374151]">
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
                                    <p className="text-sm text-gray-500">Torneo</p>
                                    <input type="text" name="nombre" id="nombre" value={filtro.nombre} onChange={handleChangeFiltro} className="border border-[#868686] rounded-sm" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Premio</p>
                                    <input type="range" min="0" max="100000" step="1000" name="premio" id="premio" value={filtro.premio} onChange={handleChangeFiltro} className="border border-[#868686] rounded-sm" />
                                    <span className="text-sm text-gray-700">{filtro.premio}€</span>
                                </div>
                                {/* <div>
                                    <p className="text-sm text-gray-500">Fecha de inicio</p>
                                    <input type="date" name="fechaInicio" id="fechaInicio" value={filtro.fechaInicio} onChange={handleChangeFiltro} className="border border-[#868686] rounded-sm" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Fecha de fin</p>
                                    <input type="date" name="fechaFin" id="fechaFin" value={filtro.fechaFin} onChange={handleChangeFiltro} className="border border-[#868686] rounded-sm" />
                                </div> */}
                                <div>
                                    <p className="text-sm text-gray-500">Deporte</p>
                                    <input type="text" name="deporte" id="deporte" value={filtro.deporte} onChange={handleChangeFiltro} className="border border-[#868686] rounded-sm" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Localización</p>
                                    <input type="text" name="localizacion" id="localizacion" value={filtro.localizacion} onChange={handleChangeFiltro} className="border border-[#868686] rounded-sm" />
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
                                data.datos.$values.map((t: Torneo, i: number) => {
                                    return (
                                        <div key={t.$id} className={`mb-5 items-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 ${i === data.datos.$values.length - 1 ? '' : ' border-b-2 border-b-[#F3F4F6]'}`}>
                                            <div>
                                                <p className="text-sm text-gray-500">Torneo</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{t.nombre}</p>
                                            </div>
                                            <div className="mt-2 lg:mt-0">
                                                <p className="text-sm text-gray-500">Localización</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{t.localizacion}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Fecha</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{t.fechaInicio} - {t.fechaFin}</p>
                                            </div>
                                            <div className="mt-2 lg:mt-0">
                                                <p className="text-sm text-gray-500">Deporte</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{t.deporte.deporte}</p>
                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                <p className="text-sm text-gray-500">Premio</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{t.premio}</p>
                                            </div>
                                            <div className="mt-2 lg:mt-0">
                                                <p className="text-sm text-gray-500">Organizador</p>
                                                <a href={`mailto:${t.organizador.email}`} className="text-base font-medium text-gray-800 break-words">{t.organizador.email}</a>
                                            </div>
                                            <div className="mt-2 lg:mt-0 text-center">
                                                <button title="Editar torneo" onClick={() => handleRedirect(t.id)} className=" cursor-pointer bg-[#ff9900] p-1 rounded-sm text-white hover:bg-[#ffbc58]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : <p>No hay ningún torneo registrado</p>}
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