import { useEffect, useState } from "react";
import { Boton } from "../../Componentes_Personalizados/BotonPrincipal";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";
import { useFetch } from "../../Hooks_Personalizados/UseFetch";

interface DatosEquipo {
    visible: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    idTorneo: string | undefined;
}

export function FormRegistroEquipo({ visible, idTorneo }: DatosEquipo) {

    interface EquipoTorneo {
        Id_torneo: string | undefined,
        Id_equipo: string
    }

    const { token, setMensaje } = useAuth();
    const { data, loading, error, fetchData } = useFetch();
    const [equipos, setEquipos] = useState<any>([]);
    const [equipo, setEquipo] = useState<EquipoTorneo>({
        Id_torneo: idTorneo,
        Id_equipo: ''
    })

    useEffect(() => {
        const fetchEquipos = async () => {
            const eqp = await axios.get(`http://localhost:5170/api/Equipos/NoTorneo/${idTorneo}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                }
            });

            setEquipos(eqp.data.equipos.$values);
        }

        fetchEquipos();
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setEquipo(prev => ({
            ...prev, [name]: value
        }));
    }

    const handleFetch = () => {
        fetchData(`http://localhost:5170/api/Equipos/EquipoTorneo`, 'post', { body: equipo }, token);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleFetch();
    }

    useEffect(() => {
        if (data) {
            setMensaje(data.message);
            visible();
        }
    }, [data]);

    // useEffect(() => {
    //     if (equipos) console.log(equipos)
    // }, [equipos])

    return (
        <form onSubmit={handleSubmit} className="text-white">
            <div className="fixed inset-0 bg-gray-90 backdrop-blur-xs flex justify-center items-center z-50">
                <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md">

                    {error ? (
                        <div className="bg-linear-to-r from-rose-500 via-pink-500 to-red-500 rounded-md p-2 mb-4">
                            <p className="text-white">{error}</p>
                        </div>
                    ) : loading ? (
                        <div className="absolute inset-0 bg-gray-500 bg-opacity-30 flex justify-center items-center z-10">
                            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : null}

                    <p className="text-lg font-semibold mb-4">Añadir equipo</p>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm text-white">Equipos</p>
                        <input required list="equipos" name="Id_equipo" value={equipo.Id_equipo} onChange={handleChange} placeholder="Selecciona un equipo" className="bg-white text-black rounded p-1" />
                        <datalist id="equipos">
                            {equipos.map((org: any, i: number) => (
                                <option value={`${org.id}`} key={i}>{org.nombre}</option>
                            ))}
                        </datalist>
                    </div>

                    <div className="flex justify-end mt-4 space-x-2">
                        <Boton type="button" mensaje="Cerrar" accion={visible} colores="bg-red-700 hover:bg-red-600" />
                        <Boton type="submit" mensaje="Guardar" colores="bg-emerald-600 hover:bg-emerald-700" />
                    </div>

                </div>
            </div>
        </form>
    )
}