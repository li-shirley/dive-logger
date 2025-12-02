import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'
import { Link } from 'react-router-dom'


const Signup = () => {
    const { signup, error, isLoading } = useSignup()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const [errors, setErrors] = useState({ email: '', password: '' })

    const validateEmail = (value) => {
        if (!value.trim()) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Invalid email format'
        return ''
    }

    const validatePassword = (value) => {
        if (!value.trim()) return 'Password is required'
        const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!pwRegex.test(value)) {
            return 'Password must contain at least 8 characters, include an upper/lowercase, number, and special character'
        }
        return ''
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const emailErr = validateEmail(email)
        const passwordErr = validatePassword(password)

        setErrors({ email: emailErr, password: passwordErr })

        if (emailErr || passwordErr) return

        await signup(email, password)
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-sand-light p-6">
            <form
                noValidate
                className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-md flex flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <h3 className="text-xl font-semibold text-ocean-deep">Sign Up</h3>

                {/* Email */}
                <label>Email:</label>
                <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className={`p-3 border rounded focus:outline-none focus:border-ocean-mid focus:ring-ocean-light ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.email && (
                    <div className="text-red-500 text-sm -mt-2">{errors.email}</div>
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
                    <div className="text-red-500 text-sm -mt-2">{errors.password}</div>
                )}

                <button
                    disabled={isLoading}
                    className="bg-ocean-mid text-sand-light py-2 rounded shadow hover:bg-ocean-deep disabled:opacity-50 transition-all"
                >
                    Sign Up
                </button>

                {error && <div className="text-red-500 font-medium">{error}</div>}

                <p className="text-sm text-gray-700 mt-2 text-center">
                    Already a user?{' '}
                    <Link to="/login" className="text-ocean-mid font-medium hover:underline">
                        Login
                    </Link>
                </p>

            </form>
        </div>
    )
}


export default Signup