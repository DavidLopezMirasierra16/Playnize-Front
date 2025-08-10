import { useState } from "react"

export function Cookies() {

    const [aceptar, setAceptar] = useState<boolean>(false);
    const [click, setClick] = useState<boolean>(false);
    const cookie = document.cookie.includes("cks_plnz_aceptadas=true");

    const handlerAceptar = () => {
        setAceptar(true);
        setClick(true);
        document.cookie = "cks_plnz_aceptadas=true; max-age=31536000;";
    }

    const handleDenegar = () => {
        setAceptar(false);
        setClick(true);
    }

    return (
        <>
            {!cookie && (
                <div className={`${click && "hidden"}`}>
                    <div className={`fixed inset-0 bg-[#a8a29e] opacity-50 z-40`}></div>
                    <div className={`fixed bottom-0 left-0 w-full bg-red-700 text-white px-4 py-3 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 z-50`}>
                        <p>
                            Al continuar navegando aceptas nuestra política de cookies. Puedes cambiar tus preferencias desde la configuración del navegador. Para continuar navegando, es necesario aceptar nuestra política de cookies.
                        </p>
                        <div className="flex gap-5">
                            <button onClick={handlerAceptar} className="cursor-pointer hover:text-gray-300">Aceptar</button>
                            <button onClick={handleDenegar} className="cursor-pointer hover:text-gray-300">Denegar</button>
                        </div>
                    </div>

                </div>
            )}
        </>
    )
}