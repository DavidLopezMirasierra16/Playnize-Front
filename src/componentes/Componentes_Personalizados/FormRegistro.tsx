import { useEffect, useState } from "react"
import { Boton } from "./BotonPrincipal"
import { useAuth } from "../Auth/AuthContext";
import { useFetch } from "../Hooks_Personalizados/UseFetch";

interface Registro {
    name?: string,
    mensaje: string,
    visible: (e?: React.MouseEvent<HTMLButtonElement> | string) => void,
    url: string,
    datosEditar?: Datos,
    id?: string
}

interface Datos {
    descripcion: string
}

export function FormRegistro({ name, mensaje, visible, url, datosEditar, id }: Registro) {

    const { token, setMensaje } = useAuth();
    const { data, loading, error, fetchData } = useFetch();
    const [datos, setDatos] = useState({
        descripcion: datosEditar?.descripcion || '',
        torneo: id?.toString() ?? '' //Por defecto va a tener el id ya asignado (?? porque es number)
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos(prev => ({
            ...prev, [name]: value
        }));
    }

    const handleFetch = () => {
        const endpoint = datosEditar ? url + `/${id}` : url;
        const method = datosEditar ? 'put' : 'post';
        fetchData(endpoint, method, { body: datos }, token);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleFetch();
    }

    useEffect(() => {
        if (data) {
            setMensaje(data.message)
            visible(mensaje);
        }
    }, [data]);

    return (
        <>
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

                        <h2 className="text-lg font-semibold mb-4">{!datosEditar ? `Añadir ${mensaje}` : `Editar ${mensaje}`}</h2>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-white">Descripción</p>
                            <input type="text" name="descripcion" required value={datos.descripcion} onChange={handleChange} className="border rounded p-1 bg-white text-black" placeholder="Explicación" />
                        </div>
                        <div className="flex justify-end mt-4 space-x-2">
                            <button type="button" name={name} onClick={visible} className="flex flex-wrap gap-1 items-center cursor-pointer p-1 rounded-sm bg-red-700 hover:bg-red-600">Cerrar</button>
                            <Boton type="submit" mensaje="Guardar" colores="bg-emerald-600 hover:bg-emerald-700" />
                        </div>

                    </div>
                </div>
            </form>
        </>
    )
}