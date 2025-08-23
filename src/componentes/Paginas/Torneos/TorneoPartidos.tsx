import { useParams } from "react-router-dom"
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import type { Url } from "../Deportes/Deportes";
import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";

export function TorneoPartidos({ url }: Url) {

    interface Partido {
        id: number,
        fecha: string,
        idLocal: number,
        nombreLocal: string,
        idVisitante: number,
        nombreVisitante: string,
        resultado: {
            $values: Resultado[];
        };
    }

    interface Resultado {
        resultado: string,
        ganador: number
    }

    const { id } = useParams();
    const { token } = useAuth();
    const { data, loading, error, fetchData } = useFetch();
    const [partidos, setPartidos] = useState<any>();

    useEffect(() => {
        fetchData(url + `/${id}`, "get", {}, token);
    }, []);

    useEffect(() => {
        if (data) {
            const equipos = data.partidos.equipo_resultados.$values.length > 0 ? data.partidos.equipo_resultados.$values : []
            const noequipos = data.partidos.noequipo_resultados.$values.length > 0 ? data.partidos.noequipo_resultados.$values : []

            let datosPartidos: any[] = [];
            if (equipos.length > 0) {
                datosPartidos = equipos;
            } else if (noequipos.length > 0) {
                datosPartidos = noequipos;
            }

            setPartidos(datosPartidos);
        }
    }, [data])

    // useEffect(()=>{
    //     if(partidos) console.log(partidos)
    // },[partidos])

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
                        <p className="mb-4 font-bold text-lg">Partidos del torneo: {data.partidos.nombre}</p>

                        {/* Filtros */}

                        {/* Tabla */}
                        <div>
                            {partidos ? (
                                partidos.map((p: Partido, i: number) => {
                                    return (
                                        <div key={i} className={`mb-5 items-center grid grid-cols-2 md:grid-cols-4 ${i === partidos.length - 1 ? '' : ' border-b-2 border-b-[#F3F4F6]'} `}>
                                            <div>
                                                <p className="text-sm text-gray-500">Equipo local</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{p.nombreLocal}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Equipo visitante</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{p.nombreVisitante}</p>
                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                <p className="text-sm text-gray-500">Fecha</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{p.fecha}</p>
                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                <p className="text-sm text-gray-500">Resultado</p>
                                                {p.resultado.$values.length > 0 ? (
                                                    p.resultado.$values.map((r: Resultado, k: number) => {
                                                        return (
                                                            <div key={k}>
                                                                <div>
                                                                    <p className="text-base font-medium text-gray-800 break-words">{r.resultado}</p>
                                                                </div>
                                                                {/* <div>
                                                                    <p className="text-sm text-gray-500">Ganador</p>
                                                                    <p>{r.ganador}</p>
                                                                </div> */}
                                                            </div>
                                                        )
                                                    })
                                                ) : <p className="text-base font-medium text-gray-800 break-words">Sin jugar</p>}
                                            </div>
                                        </div>
                                    )
                                })
                            ) : <p>No hay partidos registrados</p>}
                        </div>

                    </div>
                </div>
            )}

        </>
    )
}