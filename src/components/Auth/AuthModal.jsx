import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X, Eye, EyeOff, Mail, User, Lock, ArrowRight } from 'lucide-react';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAuthModal, setAuthenticated } from '../../store/cart';
import { login, register as registerApi, googleLogin as apiGoogleLogin } from '../../services/api';
import { GoogleLogin } from '@react-oauth/google';

const AuthModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { isAuthModalOpen } = useSelector((state) => state.cart);
    const modalRef = useRef(null);

    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // --- End Google OAuth ---

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm();

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleEsc);
        }

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const onLogin = async (data) => {
        try {
            const payload = {
                name: data.username,
                password: data.password
            };
            const result = await login(payload);

            if (result.status === 'success') {
                localStorage.setItem("token", result.token);
                localStorage.setItem("user", JSON.stringify(result.data));
                console.log(result.token)
                console.log(result.data)
                dispatch(setAuthenticated(true));
                onClose();
                reset();
            }
        } catch (error) {
            console.error("Login error:", error);
            const errMessage = error.response?.data?.message || "Login failed";
            alert(errMessage);
        }
    };

    const onRegister = async (data) => {
        try {
            const payload = {
                name: data.username,
                email: data.email,
                password: data.password
            };
            const result = await registerApi(payload);
            if (result.status === 'success') {
                alert("User registered successfully");
                // Option: log them in immediately after register securely. But for now, just tell them. Wait, if we have the token we can do it. Assuming backend register might not send token out of the box. Assuming we don't.
                onClose();
                setIsLogin(true); // Switch view to login for next time
                reset();
            }
        } catch (error) {
            console.error("Registration error:", error);
            const errMessage = error.response?.data?.message || "Registration failed";
            alert(errMessage);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // credentialResponse.credential IS the JWT id_token from Google
            const result = await apiGoogleLogin(credentialResponse.credential);
            if (result.status === 'success') {
                localStorage.setItem("token", result.token);
                localStorage.setItem("user", JSON.stringify(result.data));
                console.log(result.token)
                console.log(result.data)
                dispatch(setAuthenticated(true));
                onClose();
                reset();
            }
        } catch (error) {
            console.error("Google Server error:", error);
            alert("Google Authentication failed on the server.");
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        reset();
    };

    const password = watch("password");

    return (
        <div
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-md glassmorphism p-8 rounded-[2rem] shadow-2xl overflow-hidden scale-in-center animate-in zoom-in-95 duration-300"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/10 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-800" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold font-zentry text-gray-900 uppercase tracking-wider">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm">
                        {isLogin ? 'Sign in to continue to checkout' : 'Join Urbanville for the best experience'}
                    </p>
                </div>

                <form onSubmit={handleSubmit(isLogin ? onLogin : onRegister)} className="space-y-4">
                    {/* Username Field */}
                    <div className="relative">
                        <label className="text-xs font-semibold text-gray-700 ml-1 mb-1 block">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                {...register("username", { required: "Username is required" })}
                                type="text"
                                className="w-full bg-white/50 border border-white/20 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-black/20 transition-all text-sm"
                                placeholder="Enter your username"
                            />
                        </div>
                        {errors.username && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.username.message}</p>}
                    </div>

                    {/* Email Field (Registration Only) */}
                    {!isLogin && (
                        <div className="relative">
                            <label className="text-xs font-semibold text-gray-700 ml-1 mb-1 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    type="email"
                                    className="w-full bg-white/50 border border-white/20 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-black/20 transition-all text-sm"
                                    placeholder="your@email.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.email.message}</p>}
                        </div>
                    )}

                    {/* Password Field */}
                    <div className="relative">
                        <label className="text-xs font-semibold text-gray-700 ml-1 mb-1 block">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Min 6 characters" }
                                })}
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-white/50 border border-white/20 rounded-2xl py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-black/20 transition-all text-sm"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password (Registration Only) */}
                    {!isLogin && (
                        <div className="relative">
                            <label className="text-xs font-semibold text-gray-700 ml-1 mb-1 block">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    {...register("confirmPassword", {
                                        required: "Please confirm password",
                                        validate: value => value === password || "Passwords do not match"
                                    })}
                                    type={showPassword ? "text" : "password"}
                                    className="w-full bg-white/50 border border-white/20 rounded-2xl py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-black/20 transition-all text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.confirmPassword.message}</p>}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-black text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors shadow-lg mt-6"
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-8 text-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <span className="relative px-4 bg-transparent text-gray-500 text-xs uppercase font-bold tracking-widest">or continue with</span>
                </div>

                {/* OAuth Buttons */}
                <div className="flex items-center justify-center">

                    <div className="flex items-center justify-center py-1">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                console.log('Google Login Failed');
                            }}
                            type="standard"
                            shape="pill"
                            theme="outline"
                            text="signin_with"
                            width="100%"
                        />
                    </div>


                </div>

                {/* Toggle Link */}
                <p className="text-center mt-8 text-sm text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button
                        onClick={toggleMode}
                        className="font-bold text-black underline underline-offset-4"
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
