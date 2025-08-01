import { useState } from "react";
import axios from "axios";

type Method = "get" | "post" | "put" | "delete" | "patch";

interface Options {
    body?: any; // para POST, PUT, DELETE
    params?: Record<string, any>; // para GET
    headers?: Record<string, string>;
}

export function useFetch() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (
        url: string,
        method: Method,
        options: Options = {},
        token?: string | null
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios({
                url,
                method,
                data: method !== "get" ? options.body : undefined, // solo si no es GET
                params: method === "get" ? options.params : undefined, // solo si es GET
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    ...options.headers,
                },
            });

            setData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Error");
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, setError, fetchData };
}