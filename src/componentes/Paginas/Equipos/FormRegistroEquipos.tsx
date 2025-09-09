import { useEffect, useState } from "react";
import { Boton } from "../../Componentes_Personalizados/BotonPrincipal";
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import { useAuth } from "../../Auth/AuthContext";
import axios from "axios";
import { useLocation } from "react-router-dom";

interface Datos {
    visible: (e?: React.MouseEvent<HTMLButtonElement>, key?: 'agregar' | 'filtros') => void,
    datosEditar?: Equipo,
    idEquipo?: string
}

export interface Equipo {
    Nombre: string,
    Id_integrante: string,
    Activo: boolean
}

export function FormRegistroEquipos({ visible, datosEditar, idEquipo }: Datos) {

    const location = useLocation();
    const { token, rol, setMensaje } = useAuth();
    const { data, loading, error, fetchData } = useFetch();
    const [organizadores, setOrganizadores] = useState<any>([]);
    const [datos, setDatos] = useState<Equipo>({
        Nombre: datosEditar ? datosEditar.Nombre : '',
        Id_integrante: datosEditar ? `${datosEditar.Id_integrante}` : '',
        Activo: datosEditar ? datosEditar.Activo : true
    });

    useEffect(() => {
        const orgSelect = async () => {
            const org = await axios.get(`http://localhost:5170/api/Usuario/Org`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                }
            });
            setOrganizadores(org.data.organizadores.$values);
        }

        orgSelect();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setDatos(prev => ({
            ...prev, [name]: type === "checkbox" ? checked : value
        }));
    }

    const handleFetch = () => {
        const url = datosEditar ? `http://localhost:5170/api/Equipos/${idEquipo}` : `http://localhost:5170/api/Equipos`;
        const method = datosEditar ? 'put' : 'post';
        fetchData(url, method, { body: datos }, token);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleFetch();
    }

    useEffect(() => {
        if (data) {
            setMensaje(data.message);
            datosEditar ? visible(undefined, 'agregar') : visible();
        }
    }, [data])

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

                    <h2 className="text-lg font-semibold mb-4">{location.pathname == "/panel/equipos" ? "Crear equipo" : "Editar equipo"}</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-white">Nombre</p>
                            <input type="text" name="Nombre" required value={datos.Nombre} onChange={handleChange} className="border rounded p-1 bg-white text-black" placeholder="Rol" />
                        </div>
                        {rol == 1 && !datosEditar && (
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-white">Asignar a</p>
                                <input list="organizadores" name="Id_integrante" value={datos.Id_integrante} onChange={handleChange} placeholder="Selecciona un organizador (no obligatorio)" className="bg-white text-black rounded p-1" />
                                <datalist id="organizadores">
                                    {organizadores.map((org: any, i: number) => (
                                        <option value={`${org.id}`} key={i}>{`${org.nombre} ${org.apellidos}`}</option>
                                    ))}
                                </datalist>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                            <p className="text-sm text-white">Activo</p>
                            <input type="checkbox" name="Activo" checked={datos.Activo} onChange={handleChange} className="border rounded p-1 bg-white text-black" placeholder="Rol" />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                        <Boton type="button" mensaje="Cerrar" name="agregar" accion={visible} colores="bg-red-700 hover:bg-red-600" />
                        <Boton type="submit" mensaje="Guardar" name="" colores="bg-emerald-600 hover:bg-emerald-700" />
                    </div>
                </div>
            </div>
        </form>
    )
}