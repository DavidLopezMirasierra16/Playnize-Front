import { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { AsideAdmin } from "./Paneles/AsideAdministrador";
import { AsideOrganizador } from "./Paneles/AsideOrganizador";
import { AsideParticipante } from "./Paneles/AsideParticipante";
import { Outlet } from "react-router-dom";

export function LayoutRegister() {
    const [visible, setVisible] = useState<boolean>(false);
    const [asidePanel, setAside] = useState<React.ReactNode>();
    const { rol } = useAuth();
    const asiVisible = { onClose: () => setVisible(false) };

    const handleVisibilidad = () => {
        setVisible(!visible);
    };

    useEffect(() => {
        switch (rol) {
            case 1:
                setAside(<AsideAdmin {...asiVisible} />);
                break;
            case 2:
                setAside(<AsideOrganizador {...asiVisible} />);
                break;
            case 3:
                setAside(<AsideParticipante {...asiVisible} />);
                break;
        }
    }, [rol]);


    return (
        <div className="relative min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out
                    ${visible ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0 lg:relative lg:top-auto lg:left-auto lg:h-auto lg:w-full lg:block
                `}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <a href="/panel" className="lg:m-auto">
                        <img
                            src="/imagenes/Playnize LOGO-No-Fondo2.png"
                            alt="Playnize logo"
                            className="w-32"
                        />
                    </a>
                    <button className="lg:hidden cursor-pointer" onClick={handleVisibilidad}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className="p-4 space-y-4 grid grid-cols-1">
                    {asidePanel}
                </nav>
            </aside>

            {/* Móvil */}
            {visible && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={handleVisibilidad}
                />
            )}

            {/* Main */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between p-4 lg:hidden bg-gray-800 text-white">
                    <button onClick={handleVisibilidad} className="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="text-lg font-semibold">Tu panel</span>
                </div>

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
