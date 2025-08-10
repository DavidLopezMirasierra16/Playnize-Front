import Banner_Home from '../../../public/imagenes/Banner_Home.png'

export function Inicio() {
    return (
        <div className="ocultar-scroll p-2">
            <img src={Banner_Home} alt="Banner del Home" className="" />
            <div className="bg-white rounded-md shadow-sm p-5 mt-6">
                <p>Inicio</p>
            </div>
        </div>
    )
}