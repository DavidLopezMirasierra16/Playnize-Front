import axios from "axios";
import { Boton } from "../../Componentes_Personalizados/BotonPrincipal";
import { useAuth } from "../../Auth/AuthContext";
import { useEffect, useState } from "react";
import { useFetch } from "../../Hooks_Personalizados/UseFetch";

interface DatosPartido {
    visible: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    idTorneo: string | undefined;
    colectivo: boolean;
}

interface Equipo {
    $id: string,
    id: number,
    nombre: string
}

interface InfoPartido {
    Id_torneo: string | undefined,
    Id_equipo_local: number,
    Id_equipo_visitante: number,
    Fecha: string
}

export function FormRegistroPartido({ visible, idTorneo, colectivo }: DatosPartido) {

    const { token, setMensaje } = useAuth();
    const { data, loading, error, fetchData } = useFetch();
    const [equipos, setEquipos] = useState([]);
    const [datos, setDatos] = useState<InfoPartido>({
        Id_torneo: idTorneo,
        Id_equipo_local: 0,
        Id_equipo_visitante: 0,
        Fecha: ''
    });
    const [errorEquipos, setErrorEquipos] = useState<boolean>(false);

    useEffect(() => {
        const fetchEquipos = async () => {
            try {
                const equiposLista = await axios.get(`http://localhost:5170/api/Equipos/Torneo/${idTorneo}`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : ''
                    }
                })

                setEquipos(equiposLista.data.equipos.$values)
            } catch (error) {
                console.error(error);
            }
        }

        fetchEquipos();
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;

        setDatos(prev => ({
            ...prev, [name]: value
        }))
    }

    const handleFetch = () => {
        if (datos.Id_equipo_local == datos.Id_equipo_visitante) {
            setErrorEquipos(true);
            return
        } else {
            setErrorEquipos(false);
            const url_fetch = colectivo ? "http://localhost:5170/api/PartidoEquipos" : "http://localhost:5170/api/PartidoNoEquipos";
            fetchData(url_fetch, 'post', { body: datos }, token);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleFetch();
    }

    useEffect(() => {
        if (data){
            setMensaje(data.message)
            visible();
        } 
    }, [data]);

    return (
        <form onSubmit={handleSubmit} className="text-white">
            <div className="fixed inset-0 bg-gray-90 backdrop-blur-xs flex justify-center items-center z-50">
                <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md">

                    {errorEquipos || error ? (
                        <div className="bg-linear-to-r from-rose-500 via-pink-500 to-red-500 rounded-md p-2 mb-4">
                            <p className="text-white">{error != null ? error : "No pueden ser el mismo equipo"}</p>
                        </div>
                    ) : loading ? (
                        <div className="absolute inset-0 bg-gray-500 bg-opacity-30 flex justify-center items-center z-10">
                            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : null}

                    <h2 className="text-lg font-semibold mb-4">Añadir partido</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-white">Local</p>
                            <select required name="Id_equipo_local" className="border border-[#868686] rounded-sm bg-white text-black" onChange={handleChange}>
                                <option value="0">Seleccione el equipo local</option>
                                {equipos && (
                                    equipos.map((e: Equipo, i: number) => {
                                        return (
                                            <option key={i} value={e.id}>{e.nombre}</option>
                                        )
                                    })
                                )}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-white">Visitante</p>
                            <select required name="Id_equipo_visitante" className="border border-[#868686] rounded-sm bg-white text-black" onChange={handleChange}>
                                <option value="0">Seleccione el equipo visitante</option>
                                {equipos && (
                                    equipos.map((e: Equipo, i: number) => {
                                        return (
                                            <option key={i} value={e.id}>{e.nombre}</option>
                                        )
                                    })
                                )}
                            </select>
                        </div>
                        <div>
                            <p className="text-sm text-white">Fecha</p>
                            <input required type="date" name="Fecha" value={datos.Fecha} onChange={handleChange} className="ps-1 rounded-sm bg-white text-black" />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                        <Boton type="button" mensaje="Cerrar" name="registro" accion={visible} colores="bg-red-700 hover:bg-red-600" />
                        <Boton type="submit" mensaje="Guardar" colores="bg-emerald-600 hover:bg-emerald-700" />
                    </div>
                </div>
            </div>
        </form>
    )
}