import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function UlluAuth() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        console.log("Auth Page Loaded. Token present:", !!token);

        if (token) {
            console.log("Saving token and redirecting...");
            sessionStorage.setItem("gh_token", token);
            setTimeout(() => {
                navigate("/ullu-admin");
            }, 500); // Small delay to ensure storage writes
        } else {
            console.error("No token found in URL");
            // navigate("/ullu-admin"); 
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono p-8 text-center">
            <h2 className="text-xl mb-4 text-[#7affc0]">AUTHENTICATING...</h2>
            <p className="text-gray-500 mb-4">Please wait while we secure your connection.</p>
            <p className="text-xs text-gray-700 font-mono">
                Token: {searchParams.get("token") ? "RECEIVED" : "MISSING"}
            </p>
            <button
                onClick={() => navigate("/ullu-admin")}
                className="mt-8 text-xs underline text-gray-500 hover:text-white"
            >
                Stuck? Click here to go to Dashboard manually.
            </button>
        </div>
    );
}
