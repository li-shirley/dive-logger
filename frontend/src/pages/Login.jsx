import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'
import { Link } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emptyFields, setEmptyFields] = useState([])
    const { login, error, isLoading } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const missing = []
        if (!email.trim()) missing.push('email')
        if (!password.trim()) missing.push('password')
        if (missing.length > 0) {
            setEmptyFields(missing)
            return
        }
        setEmptyFields([])
        await login(email, password)
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-sand-light p-6">
            <form
                className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-md flex flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <h3 className="text-xl font-semibold text-ocean-deep">Login</h3>

                <label>Email:</label>
                <input
                    type="email"
                    autoComplete="username"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className={`p-3 border rounded focus:outline-none focus:border-ocean-mid focus:ring-ocean-light ${emptyFields.includes('email') ? 'border-red-500' : 'border-gray-300'
                        }`}
                />

                <label>Password:</label>
                <input
                    type="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className={`p-3 border rounded focus:outline-none focus:border-ocean-mid focus:ring-ocean-light ${emptyFields.includes('password') ? 'border-red-500' : 'border-gray-300'
                        }`}
                />

                <button
                    disabled={isLoading}
                    className="bg-ocean-mid text-sand-light py-2 rounded shadow hover:bg-ocean-deep disabled:opacity-50 transition-all"
                >
                    Login
                </button>

                {error && <div className="text-red-500 font-medium">{error}</div>}

                {/* Footer link */}
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
