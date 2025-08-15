import { useParams } from "react-router-dom";
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import { useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext";

export function UsuarioEditar() {

    const { token } = useAuth();
    const { id } = useParams();
    const { data, loading, error, fetchData } = useFetch();

    useEffect(() => {
        fetchData(`http://localhost:5170/api/Usuario/${id}`, 'get', {}, token);
    }, []);

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <>
            <p>{id}</p>
        </>
    )
}