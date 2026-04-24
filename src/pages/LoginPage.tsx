import React, { useState } from "react";
import { registerUser, loginUser } from "@/store/authStore";
import { AuthUser } from "@/types";

type Mode = "login" | "register";

interface LoginPageProps {
    onLogin: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [mode, setMode] = useState<Mode>("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const reset = (newMode: Mode) => {
        setMode(newMode);
        setError("");
        setPassword("");
        setConfirm("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password) {
            setError("Preencha todos os campos.");
            return;
        }

        if (mode === "register") {
            if (password !== confirm) {
                setError("As senhas não coincidem.");
                return;
            }
            if (password.length < 6) {
                setError("A senha deve ter pelo menos 6 caracteres.");
                return;
            }
        }

        setLoading(true);
        try {
            const result =
                mode === "register"
                    ? await registerUser(username.trim(), password)
                    : await loginUser(username.trim(), password);

            if (typeof result === "string") {
                setError(result);
            } else {
                onLogin(result);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#5C94FC] p-4">
            {/* Logo / Title */}
            <div className="retro-container w-full max-w-xs mb-6 text-center">
                <div className="text-2xl text-white drop-shadow-md mb-1">🍊</div>
                <h1 className="text-sm text-white drop-shadow-md">Pomar Urbano</h1>
                <p className="text-[8px] text-white mt-1 drop-shadow-sm opacity-80">
                    Mapeie árvores frutíferas da sua cidade
                </p>
            </div>

            {/* Auth Card */}
            <div className="retro-container w-full max-w-xs">
                {/* Tab switcher */}
                <div className="flex mb-4 border-b-4 border-black -mx-4 px-4 pb-0">
                    <button
                        type="button"
                        onClick={() => reset("login")}
                        className={`flex-1 py-2 text-[10px] uppercase font-bold border-r-2 border-black transition-colors ${mode === "login"
                                ? "bg-[#F8D820] text-black"
                                : "bg-transparent text-white hover:bg-white/10"
                            }`}
                    >
                        Entrar
                    </button>
                    <button
                        type="button"
                        onClick={() => reset("register")}
                        className={`flex-1 py-2 text-[10px] uppercase font-bold transition-colors ${mode === "register"
                                ? "bg-[#F8D820] text-black"
                                : "bg-transparent text-white hover:bg-white/10"
                            }`}
                    >
                        Cadastrar
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-white drop-shadow-sm">
                            Usuário
                        </label>
                        <input
                            type="text"
                            className="retro-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="ex: FarmerJoe"
                            autoComplete="username"
                            maxLength={20}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-white drop-shadow-sm">
                            Senha
                        </label>
                        <input
                            type="password"
                            className="retro-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            autoComplete={mode === "register" ? "new-password" : "current-password"}
                        />
                    </div>

                    {mode === "register" && (
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-white drop-shadow-sm">
                                Confirmar Senha
                            </label>
                            <input
                                type="password"
                                className="retro-input"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="••••••"
                                autoComplete="new-password"
                            />
                        </div>
                    )}

                    {error && (
                        <div className="bg-[#E83030] border-4 border-black p-2 text-[10px] text-white text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="retro-button w-full mt-2"
                    >
                        {loading ? "..." : mode === "login" ? "ENTRAR" : "CADASTRAR"}
                    </button>
                </form>
            </div>
        </div>
    );
};
