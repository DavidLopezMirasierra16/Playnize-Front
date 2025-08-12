import { useEffect, useState } from "react"
import { Boton } from "./BotonPrincipal"
import { useFetch } from "../Hooks_Personalizados/UseFetch"
import { useAuth } from "../Auth/AuthContext"

interface DatosDeporte {
    visible: () => void
}

export interface DeporteData {
    Deporte: string,
    Colectivo: string,
    MinimoPorEquipo: string,
    MaximoPorEquipo: string,
}

export function RegistrarDeporte({ visible }: DatosDeporte) {

    const { token, setMensaje } = useAuth();
    const { data, loading, error, fetchData } = useFetch();
    const [deporte, setDeporte] = useState<DeporteData>({
        Deporte: '',
        Colectivo: '',
        MinimoPorEquipo: '',
        MaximoPorEquipo: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDeporte(prev => ({ ...prev, [name]: value }));
    }

    const handleFetch = () => {
        fetchData('http://localhost:5170/api/Deportes/Crear', "post", { body: deporte }, token);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleFetch();
        console.log(deporte)
    }

    useEffect(() => {
        if (data) {
            // setMensaje(data)
            console.log(data);
            visible();
        }
    }, [data]);

    return (
        <form onSubmit={handleSubmit} className="text-white">
            <div className="fixed inset-0 bg-gray-90 backdrop-blur-xs flex justify-center items-center z-50">
                <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md">

                    {error && (
                        <div className="bg-red-500 rounded-sm p-1 mb-2">
                            <p className="text-center">{error}</p>
                        </div>
                    )}

                    <h2 className="text-lg font-semibold mb-4">Añadir deporte</h2>
                    <div className="grid grid-cols-1 gap-4 text-black">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-white">Nombre</p>
                            <input type="text" name="Deporte" value={deporte.Deporte} onChange={handleChange} className="border rounded p-1 bg-white" placeholder="Nombre" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-white">Equipos</p>
                            <div className="flex flex-wrap gap-3">
                                <div className="flex flex-wrap gap-2">
                                    <input type="radio" name="Colectivo" value="1" onChange={handleChange} placeholder="Nombre" />
                                    <p className="text-white text-sm">Colectivo</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <input type="radio" name="Colectivo" value="2" onChange={handleChange} placeholder="Nombre" />
                                    <p className="text-white text-sm">Individual</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-white">Minimo por equipo</p>
                            <input type="number" name="MinimoPorEquipo" value={deporte.MinimoPorEquipo} onChange={handleChange} className="border rounded p-1 bg-white" placeholder="Número mínimo" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-white">Máximo por equipo</p>
                            <input type="number" name="MaximoPorEquipo" value={deporte.MaximoPorEquipo} onChange={handleChange} className="border rounded p-1 bg-white" placeholder="Número máximo" />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                        <Boton type="button" mensaje="Cerrar" accion={visible} colores=" bg-red-700 hover:bg-red-600" />
                        <Boton mensaje="Guardar" colores="bg-emerald-600 hover:bg-emerald-700" />
                    </div>
                </div>
            </div>
        </form>
    )
}