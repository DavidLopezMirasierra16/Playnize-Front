import { useAuth } from "../../Auth/AuthContext";
import { PanelAdministrador } from "./Administrador";
import { PanelOrganizador } from "./Organizador";
import { PanelParticpante } from "./Participante";

export function PanelSwitcher() {
    const { rol } = useAuth();

    switch (rol) {
        case 1:
            return <PanelAdministrador />;
        case 2:
            return <PanelOrganizador />;
        case 3:
            return <PanelParticpante />;
        default:
            return <div>No tienes acceso a ningún panel.</div>;
    }

}