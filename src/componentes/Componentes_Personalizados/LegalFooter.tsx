import { MensajeFooter } from "../Hooks_Personalizados/MensajesFooter"

//Tenemos que poner keyof para decirle que es una clave dentro del tipo MensajeFooter, 
//si sólo poner typeof decimos que opcion es el objeto completo
interface Option {
    opcion: keyof typeof MensajeFooter
}

export function LegalFooter({ opcion }: Option) {
    const mensaje = MensajeFooter[opcion];

    return (
        <div dangerouslySetInnerHTML={{ __html: mensaje }} className="ocultar-scroll p-2"></div>
    )
}