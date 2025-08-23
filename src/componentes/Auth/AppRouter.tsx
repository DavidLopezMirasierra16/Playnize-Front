import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { LayoutRegister } from "../Paginas/LayoutRegister";
import { Header } from "../Componentes_Personalizados/Header";
import { NotFound } from "../Componentes_Personalizados/NotFound";
import { Login } from "./Login";
import { Register } from "./Register";
import PrivateRoute from "./PrivateRoute";
import { AboutUs } from "../Paginas/Inicio/AboutUs";
import { PanelSwitcher } from "../Paginas/Paneles/PanelSwitcher";
import { Roles } from "../Paginas/Roles/Roles";
import { Perfil } from "../Paginas/Perfil/Perfil";
import { UsuariosListado } from "../Paginas/Usuarios/Usuarios";
import { UsuarioDetalle } from "../Paginas/Usuarios/UsuariosDatos";
import { UsuarioEditar } from "../Paginas/Usuarios/UsuarioEditar";
import { UsuariosAccesos } from "../Paginas/Usuarios/UsuariosAccesos";
import { Deportes } from "../Paginas/Deportes/Deportes";
import { Torneos } from "../Paginas/Torneos/Torneos";
import { Equipos } from "../Paginas/Equipos/Equipos";
import { Footer } from "../Componentes_Personalizados/Footer";
import { LegalFooter } from "../Componentes_Personalizados/LegalFooter";
import { Cookies } from "../Componentes_Personalizados/Cookies";
import { EquiposDatos } from "../Paginas/Equipos/EquiposDatos";
import { UsuarioRegistro } from "../Paginas/Usuarios/UsuarioRegistro";
import { Inicio } from "../Paginas/Inicio/Inicio";
import { TorneoRegistro } from "../Paginas/Torneos/TorneoRegistro";
import { TorneoDatos } from "../Paginas/Torneos/TorneoDatos";
import { Prueba } from "../Paginas/Prueba";
import { TorneoPartidos } from "../Paginas/Torneos/TorneoPartidos";

export function AppRouter() {
    function Layout() {
        const location = useLocation();
        const hideHeaderOn = ["/login", "/registro", "*"];
        const shouldShowHeader = !(location.pathname.startsWith("/panel") || hideHeaderOn.includes(location.pathname));

        return (
            <div className="flex flex-col min-h-screen">
                {/* Header */}
                {shouldShowHeader && <Header />}

                {/* Contenido */}
                <section className="fade-in flex-grow">
                    <Routes>

                        {/* Rutas Header */}
                        <Route path="/" element={<Inicio />} />
                        <Route path="/historia" element={<div>Historia</div>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro" element={<Register />} />
                        <Route path="/nosotros" element={<AboutUs />} />

                        {/* Rutas protegidas dentro de /panel */}
                        <Route
                            path="/panel"
                            element={
                                <PrivateRoute requiredRole={[1, 2, 3]}>
                                    <LayoutRegister />
                                </PrivateRoute>
                            }
                        >
                            {/* Panel */}
                            <Route index element={<PanelSwitcher />} />

                            <Route
                                path="perfil"
                                element={
                                    <PrivateRoute requiredRole={[1, 2, 3]}>
                                        <Perfil />
                                    </PrivateRoute>
                                }
                            />

                            {/* Roles */}
                            <Route
                                path="roles"
                                element={
                                    <PrivateRoute requiredRole={[1]}>
                                        <Roles url={`http://localhost:5170/api/Roles`} />
                                    </PrivateRoute>
                                }
                            />

                            {/* Usuarios */}
                            <Route
                                path="usuarios/listado"
                                element={
                                    <PrivateRoute requiredRole={[1]}>
                                        <UsuariosListado url={`http://localhost:5170/api/Usuario?`} />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="usuarios/empleados"
                                element={
                                    <PrivateRoute requiredRole={[1]}>
                                        <UsuariosListado url={`http://localhost:5170/api/Usuario/Admin?`} />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="usuarios/registro"
                                element={
                                    <PrivateRoute requiredRole={[1]}>
                                        <UsuarioRegistro />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="usuarios/accesos"
                                element={
                                    <PrivateRoute requiredRole={[1]}>
                                        <UsuariosAccesos url={`http://localhost:5170/api/Usuario/Accesos`} />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="usuarios/:id"
                                element={
                                    <PrivateRoute requiredRole={[1]}>
                                        <UsuarioDetalle />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="usuarios/edit/:id"
                                element={
                                    <PrivateRoute requiredRole={[1]}>
                                        <UsuarioEditar />
                                    </PrivateRoute>
                                }
                            />

                            {/* Deportes */}
                            <Route
                                path="deportes"
                                element={
                                    <PrivateRoute requiredRole={[1]}>
                                        <Deportes url={`http://localhost:5170/api/Deportes`} />
                                    </PrivateRoute>
                                }
                            />

                            {/* Torneos */}
                            <Route
                                path="torneos"
                                element={
                                    <PrivateRoute requiredRole={[1, 2]}>
                                        <Torneos url={`http://localhost:5170/api/Torneo/All`} />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="torneos/:id"
                                element={
                                    <PrivateRoute requiredRole={[1, 2, 3]}>
                                        <TorneoDatos url={`http://localhost:5170/api/Torneo/`} />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="torneos/registro"
                                element={
                                    <PrivateRoute requiredRole={[1, 2, 3]}>
                                        <TorneoRegistro url={`http://localhost:5170/api/Torneo`} />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="torneo/partidos/:id"
                                element={
                                    <PrivateRoute requiredRole={[1, 2]}>
                                        <TorneoPartidos url={`http://localhost:5170/api/Torneo/Partidos`} />
                                    </PrivateRoute>
                                }
                            />

                            {/* Equipos */}
                            <Route
                                path="equipos"
                                element={
                                    <PrivateRoute requiredRole={[1, 2]}>
                                        <Equipos url={`http://localhost:5170/api/Equipos`} />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="equipos/:id"
                                element={
                                    <PrivateRoute requiredRole={[1, 2, 3]}>
                                        <EquiposDatos url={`http://localhost:5170/api/Equipos/`} />
                                    </PrivateRoute>
                                }
                            />

                            {/* ---------------------------------------------------------------------------- */}

                            {/* Organizador */}

                            {/* ---------------------------------------------------------------------------- */}

                            {/* Participante */}

                            <Route path="*" element={<NotFound />} />
                        </Route>

                        <Route path="*" element={<NotFound />} />

                        {/* Rutas Footer */}
                        <Route path="/privacidad" element={<LegalFooter opcion="privacidad" />} />
                        <Route path="/terminos" element={<LegalFooter opcion="terminos" />} />
                        <Route path="/cookies" element={<LegalFooter opcion="cookies" />} />
                        <Route path="/imagenes" element={<LegalFooter opcion="imagenes" />} />

                    </Routes>
                </section>

                {/* Footer */}
                {shouldShowHeader && <Footer />}
                <Cookies />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    );
}
