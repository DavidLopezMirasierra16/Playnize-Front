import { Link } from "react-router-dom";

export function Footer() {

    return (
        <footer className="bg-gray-700 text-white md:p-3 fade-in mt-4">
            <div className="ocultar-scroll grid grid-cols-1 md:grid-cols-2 lg:items-center text-sm">
                <div className="w-3/12 m-auto md:m-0 md:w-4/12 lg:w-3/12 text-center">
                    <img src="/imagenes/Playnize LOGO-No-Fondo2.png" alt="Logo playnize" className="w-10/12 m-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 text-center md:text-start">
                    <div className="grid grid-cols-1 md:gap-5 lg:gap-0 lg:grid-cols-2 md:border-r border-gray-500">
                        <div className="flex flex-col gap-2 border-b border-gray-500 md:border-b-0 md:border-r p-2 md:p-0">
                            <p className="text-lg">Eventos</p>
                            <p>Mis inscripciones</p>
                            <p>Organizar</p>
                            <p>Explorar</p>
                        </div>
                        <div className="flex flex-col gap-2 border-b border-gray-500 md:border-b-0 p-2 md:p-0 lg:ms-3">
                            <p className="text-lg">Legal</p>
                            <Link to="/privacidad" style={{ color: "white", fontWeight: "normal" }}
                                onMouseEnter={e => e.currentTarget.style.color = "#d1d5db"}
                                onMouseLeave={e => e.currentTarget.style.color = "white"}>Privacidad</Link>
                            <Link to="/terminos" style={{ color: "white", fontWeight: "normal" }}
                                onMouseEnter={e => e.currentTarget.style.color = "#d1d5db"}
                                onMouseLeave={e => e.currentTarget.style.color = "white"}>Terminos y condiciones</Link>
                            <Link to="/cookies" style={{ color: "white", fontWeight: "normal" }}
                                onMouseEnter={e => e.currentTarget.style.color = "#d1d5db"}
                                onMouseLeave={e => e.currentTarget.style.color = "white"}>Cookies</Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 p-2 md:p-0 md:ms-3">
                        <p className="text-lg">Contacto</p>
                        <p>playnize@gmail.es</p>
                        <p>Twitter</p>
                        <p>Tiktok</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}