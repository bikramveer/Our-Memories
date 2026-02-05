'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            
            router.push('/');
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="
            min-h-screen
            flex
            items-center
            justify-center
            p-4
            relative
            overflow-hidden
            "
        >
            <div className="
                absolute
                inset-0
                overflow-hidden
                pointer-events-none
                "
            >
                <div className="heart-float" style={{ left: '10%', animationDelay: '0s' }}>💕</div>

                <div className="heart-float" style={{ left: '80%', animationDelay: '2s' }}>💗</div>

                <div className="heart-float" style={{ left: '50%', animationDelay: '4s' }}>💖</div>
            </div>

            <div className="
                auth-card
                w-full
                max-w-md
                relative
                z-10
                "
            >
                <div className="
                    absolute
                    -top-3
                    -right-3
                    text-pink-400
                    text-2xl
                    animate-pulse
                    "
                >
                    💕
                </div>

                <div className="flex justify-center mb-6">
                    <div className="
                        w-16
                        h-16
                        rounded-full
                        bg-gradient-to-br
                        from-pink-500
                        to-purple-500
                        flex
                        items-center
                        justify-center
                        shadow-lg
                        animate-float
                        "
                    >
                        <svg 
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path fillRule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>

                <h1 className="
                    text-3xl
                    font-bold
                    text-center
                    mb-2
                    text-gray-800
                    "
                >
                    Our Photo Book
                </h1>
                <p className="
                    text-center
                    text-gray-600
                    mb-8
                    flex
                    items-center
                    justify-center
                    gap-2
                    "
                >
                    Welcome back! 💕
                </p>

                {error && (
                    <div className="
                        mb-6
                        p-3
                        bg-red-50
                        border
                        border-red-200
                        rounded-lg
                        text-red-600
                        text-sm
                        "
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="email"
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                                "
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            className="auth-input"
                        />
                    </div>

                    <div>
                        <label htmlFor="password"
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                                "
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                            className="auth-input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-button w-full"
                    >
                        {loading ? (
                            <span className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                "
                            >
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Logging in...
                            </span>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="
                        text-sm
                        text-gray-600
                        flex
                        items-center
                        justify-center
                        gap-2
                        "
                    >
                        <span className="sparkle">✨</span>
                        Don&apos;t have an account?{' '}
                        <Link href='/signup' className="
                            text-pink-500
                            font-semibold
                            hover: text-pink-600
                            transition-colors
                            "
                        >
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes heartFloat {
                    0% {
                        transform: translateY(100vh) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.5;
                    }
                    90% {
                        opacity: 0.5;
                    }
                    100% {
                        transform: translateY(-100px) rotate(360deg);
                        opacity: 0;
                    }
                }

                .heart-float {
                    position: absolute;
                    font-size: 2rem;
                    animation: heartFloat 15s linear infinite;
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .sparkle {
                    display: inline-block;
                    animation: float 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}