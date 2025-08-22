import { useParams } from "react-router-dom"

export function Prueba() {
    const { id } = useParams();
    return (
        <p>prueba {id}</p>
    )
}