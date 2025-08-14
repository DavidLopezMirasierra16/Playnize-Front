import { Iconos } from "../Hooks_Personalizados/Iconos";

type Tipo = "submit" | "reset" | "button" | undefined;
type AccionBoton = (() => void) | ((e: React.MouseEvent<HTMLButtonElement>) => void);

interface MensajeBoton {
    type?: Tipo,
    accion?: AccionBoton,
    icono?: keyof typeof Iconos,
    mensaje?: string,
    colores?: string,
    title?: string,
    name?: string,
    disabled?: boolean
}

export function Boton({ accion, type, mensaje, icono, colores, title, name, disabled }: MensajeBoton) {
    const colores_base = 'bg-[#1E2939] hover:bg-[#374151] text-white';

    return (
        <button type={type} disabled={disabled} onClick={accion} title={title} name={name} className={`flex flex-wrap gap-1 items-center cursor-pointer p-1 rounded-sm ${colores ? colores : colores_base}`}>
            {icono && <div dangerouslySetInnerHTML={{ __html: Iconos[icono] }} />}
            {mensaje && <span>{mensaje}</span>}
        </button>
    )
}