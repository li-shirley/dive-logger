import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'
import { Link } from 'react-router-dom'

const Login = () => {
    const { login, error: serverError, isLoading } = useLogin()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)

    const validate = () => {
        const newErrors = {}

        // Missing email
        if (!email.trim()) {
            newErrors.email = 'Please enter your email.'
        }
        // Invalid email syntax
        else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please check your email.'
        }

        // Missing password
        if (!password.trim()) {
            newErrors.password = 'Please enter your password.'
        }

        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setErrors({})
        await login(email, password)
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-sand-light p-6">
            <form
                noValidate
                onSubmit={handleSubmit}
                className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-md flex flex-col gap-4"
            >
                <h3 className="text-xl font-semibold text-ocean-deep">Login</h3>

                {/* Email */}
                <label>Email:</label>
                <input
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`p-3 border rounded focus:outline-none focus:border-ocean-mid focus:ring-ocean-light ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.email && (
                    <p className="px-3 text-red-500 text-sm">{errors.email}</p>
                )}

                {/* Password */}
                <label>Password:</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`p-3 border rounded w-full focus:outline-none focus:border-ocean-mid focus:ring-ocean-light ${errors.password ? "border-red-500" : "border-gray-300"
                            }`}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-500"
                        tabIndex={-1}
                    >
                        <span className="material-symbols-outlined text-xl">
                            {showPassword ? "visibility_off" : "visibility"}
                        </span>
                    </button>
                </div>


                {errors.password && (
                    <p className="px-3 text-red-500 text-sm">{errors.password}</p>
                )}

                {/* Submit */}
                <button
                    disabled={isLoading}
                    className="bg-ocean-mid text-sand-light py-2 rounded shadow hover:bg-ocean-deep disabled:opacity-50 transition-all"
                >
                    Login
                </button>

                {/* Server error (from backend) */}
                {serverError && (
                    <div className="text-red-500 font-medium">{serverError}</div>
                )}

                {/* Footer */}
                <p className="text-sm text-gray-700 mt-2 text-center">
                    Not a user yet?{' '}
                    <Link to="/signup" className="text-ocean-mid font-medium hover:underline">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Login
