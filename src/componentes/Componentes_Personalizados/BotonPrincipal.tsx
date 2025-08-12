type Tipo = "submit" | "reset" | "button" | undefined;

interface MensajeBoton {
    type?: Tipo,
    accion?: () => void,
    icono?: string,
    mensaje?: string,
    colores?: string
}

export function Boton({ accion, type, mensaje, icono, colores }: MensajeBoton) {
    const colores_base = 'bg-[#1E2939] hover:bg-[#374151] text-white';

    return (
        <button type={type} onClick={accion} className={`flex flex-wrap gap-1 items-center cursor-pointer p-1 rounded-sm ${colores ? colores : colores_base}`}>
            {icono && icono}
            {mensaje && <span>{mensaje}</span>}
        </button>
    )
}