import { useEffect } from "react";
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import type { Url } from "../Administrador/Deportes";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";

export function EquiposDatos({ url }: Url) {

    const { token } = useAuth();
    const { data, loading, error, fetchData } = useFetch();
    const { id } = useParams();

    useEffect(() => {
        fetchData(url + `${id}`, "get", {}, token);
    }, []);

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <p>Equipo</p>
    )

}