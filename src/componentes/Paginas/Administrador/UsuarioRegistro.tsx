import { useEffect, useState } from "react"
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

export function UsuarioRegistro() {

    interface Registro {
        Nombre: string,
        Apellidos: string,
        Email: string,
        Telefono: string,
        Clave: string,
        Rol: string
    }

    const navigate = useNavigate();
    const { token, setMensaje } = useAuth();
    const { data, loading, error, setError, fetchData } = useFetch();
    const [datos, setDatos] = useState<Registro>({
        Nombre: '',
        Apellidos: '',
        Email: '',
        Telefono: '',
        Clave: '',
        Rol: ''
    });

    const handleDatos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos(prev => ({ ...prev, [name]: value }));
        setError(null)
    }

    const handleFetch = () => {
        fetchData(`http://localhost:5170/api/Acceso/Registrarse`, "post", { body: datos }, token);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleFetch();
    }

    useEffect(() => {
        if (data != null) {
            setMensaje(data.message)
            if (datos.Rol != "1") {
                navigate('/panel/usuarios/listado');
            } else {
                navigate('/panel/usuarios/empleados');
            }
        }
    }, [data]);

    return (
        <>
            <div>
                <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                    <p className="mb-4 font-bold text-lg">Formulario de Registro de un Usuario</p>

                    {error ? (
                        <div className="bg-linear-to-r from-rose-500 via-pink-500 to-red-500 rounded-md p-2 mb-4">
                            <p className="text-white">{error}</p>
                        </div>
                    ) : loading ? (
                        <div className="absolute inset-0 bg-gray-500 bg-opacity-30 flex justify-center items-center z-10">
                            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit} className="bg-gray-100 rounded-md shadow-sm p-3">
                        <div className="mb-4 flex flex-col gap-3 text-center sm:text-start sm:gap-2 lg:gap-3">
                            {/* Información personal */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="text-md font-bold whitespace-nowrap">Información personal</p>
                                    <hr className="flex-grow border-t border-gray-400" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:w-8/12">
                                    <div>
                                        <p className="text-sm text-black">Nombre</p>
                                        <input type="text" value={datos.Nombre} name="Nombre" onChange={handleDatos} className="bg-white border border-[#868686] rounded-sm w-10/12" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-black">Apellidos</p>
                                        <input type="text" value={datos.Apellidos} name="Apellidos" onChange={handleDatos} className="bg-white border border-[#868686] rounded-sm w-10/12 lg:w-12/12" />
                                    </div>
                                </div>
                            </div>
                            {/* Contacto */}
                            <div className="flex flex-col gap-2 mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="text-md font-bold whitespace-nowrap">Contacto</p>
                                    <hr className="flex-grow border-t border-gray-400" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:w-8/12">
                                    <div>
                                        <p className="text-sm text-black">Email</p>
                                        <input type="text" value={datos.Email} name="Email" onChange={handleDatos} className="bg-white border border-[#868686] rounded-sm w-10/12" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-black">Teléfono</p>
                                        <input type="text" value={datos.Telefono} name="Telefono" onChange={handleDatos} className="bg-white border border-[#868686] rounded-sm w-10/12 lg:w-12/12" />
                                    </div>
                                </div>
                            </div>
                            {/* Seguridad */}
                            <div className="flex flex-col gap-2 mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="text-md font-bold whitespace-nowrap">Seguridad</p>
                                    <hr className="flex-grow border-t border-gray-400" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:w-8/12">
                                    <div>
                                        <p className="text-sm text-black">Contraseña</p>
                                        <input type="text" value={datos.Clave} name="Clave" onChange={handleDatos} className="bg-white border border-[#868686] rounded-sm w-10/12" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm text-black">Rol</p>
                                        <div className="flex flex-wrap gap-3 justify-center lg:justify-around">
                                            <div className="flex flex-wrap gap-2 ">
                                                <input type="radio" name="Rol" value="1" onChange={handleDatos} />
                                                <p className="text-sm">Administrador/a</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 ">
                                                <input type="radio" name="Rol" value="2" onChange={handleDatos} />
                                                <p className="text-sm">Organizador/a</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 ">
                                                <input type="radio" name="Rol" value="3" onChange={handleDatos} />
                                                <p className="text-sm">Participante</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="mt-3 p-1 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
                            Guardar
                        </button>
                    </form>

                </div>
            </div>
        </>
    )
}