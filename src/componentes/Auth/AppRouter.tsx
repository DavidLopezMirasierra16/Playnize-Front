import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { LayoutRegister } from "../Paginas/LayoutRegister";
import { Header } from "../Paginas/Header";
import { NotFound } from "../Paginas/NotFound";
import { Login } from "./Login";
import { Register } from "./Register";
import PrivateRoute from "./PrivateRoute";
import { AboutUs } from "../Paginas/AboutUs";
import { PanelSwitcher } from "../Paginas/Paneles/PanelSwitcher";
import { Roles } from "../Paginas/Administrador/Roles";
import { Perfil } from "../Paginas/Perfil";
import { UsuariosListado } from "../Paginas/Administrador/Usuarios";
import { UsuarioDetalle } from "../Paginas/Administrador/UsuariosDatos";
import { UsuarioEditar } from "../Paginas/Administrador/UsuarioEditar";
import { UsuariosAccesos } from "../Paginas/Administrador/UsuariosAccesos";
import { Deportes } from "../Paginas/Administrador/Deportes";
import { Prueba } from "../Paginas/Prueba";
import { Torneos } from "../Paginas/Torneos";
import { Equipos } from "../Paginas/Equipos";
import { Footer } from "../Paginas/Footer";

export function AppRouter() {
    function Layout() {
        const location = useLocation();
        const hideHeaderOn = ["/login", "/registro", "*"];
        const shouldShowHeader = !(location.pathname.startsWith("/panel") || hideHeaderOn.includes(location.pathname));

        return (
            <>
                {/* Header */}
                {shouldShowHeader && <Header />}

                {/* Contenido */}
                <section className="fade-in">
                    <Routes>
                        <Route path="/" element={<div>Inicio</div>} />
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
                            <Route
                                path="roles"
                                element={
                                    <PrivateRoute requiredRole={[1]}>
                                        <Roles url={`http://localhost:5170/api/Roles`} />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="roles/:id"
                                element={
                                    <PrivateRoute requiredRole={[1]}>
                                        <Prueba />
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
                            <Route
                                path="deportes/:id"
                                element={
                                    <PrivateRoute requiredRole={[1]}>
                                        <UsuarioEditar />
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
                                        <Prueba />
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
                                    <PrivateRoute requiredRole={[1]}>
                                        <Prueba />
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
                    </Routes>
                </section>

                {/* Footer */}
                {shouldShowHeader && <Footer />}
            </>
        );
    }

    return (
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    );
}
