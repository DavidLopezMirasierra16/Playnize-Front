import { useEffect, useState } from "react";
import type { EditarDatos, FormEditar } from "../Paginas/Administrador/UsuariosDatos";
import { useFetch } from "../Hooks_Personalizados/UseFetch";
import { useAuth } from "../Auth/AuthContext";

export function EditarUser({ datos, visible, id, mensaje }: EditarDatos) {

    const { token } = useAuth();
    const { data, error, fetchData } = useFetch();
    const [newData, setNewData] = useState<FormEditar>({
        Nombre: datos.Nombre,
        Apellidos: datos.Apellidos,
        Email: datos.Email,
        Telefono: datos.Telefono
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewData(prev => ({ ...prev, [name]: value }));
    }

    const handleFetch = () => {
        fetchData(`http://localhost:5170/api/Usuario/${id}`, 'put', { body: newData }, token);

        if (data) mensaje(`${data.user.nombre} ${data.user.apellidos} actualizado correctamente`);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleFetch();
    }

    useEffect(() => {
        if (data) {
            mensaje(`${data.user.nombre} ${data.user.apellidos} actualizado/a correctamente`);
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

                    <h2 className="text-lg font-semibold mb-4">Editar información</h2>
                    <div className="grid grid-cols-1 gap-4 text-black">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-white">Nombre</p>
                            <input type="text" name="Nombre" value={newData.Nombre} onChange={handleChange} className="border rounded p-1 bg-white" placeholder="Nombre" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-white">Apellidos</p>
                            <input type="text" name="Apellidos" value={newData.Apellidos} onChange={handleChange} className="border rounded p-1 bg-white" placeholder="Apellidos" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-white">Email</p>
                            <input type="email" name="Email" value={newData.Email} onChange={handleChange} className="border rounded p-1 bg-white" placeholder="Email" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-white">Teléfono</p>
                            <input type="tel" name="Telefono" value={newData.Telefono} onChange={handleChange} className="border rounded p-1 bg-white" placeholder="Teléfono" />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2 text-white">
                        <button type="button" onClick={visible} className="p-1 rounded-sm bg-red-500 hover:bg-red-600 cursor-pointer">Cancelar</button>
                        <button type="submit" className="p-1 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">Guardar</button>
                    </div>
                </div>
            </div>
        </form>
    )
}