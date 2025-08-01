import { AuthProvider } from "../Auth/AuthContext";
import { AppRouter } from "../Auth/AppRouter";

export function Paginas() {
    
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
}
