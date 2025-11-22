import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'
import { Link } from 'react-router-dom' // assuming you're using react-router

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signup, error, isLoading } = useSignup()
    const [localError, setLocalError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email.trim() || !password.trim()) {
            setLocalError('All fields must be filled in')
            return
        }
        setLocalError(null)
        await signup(email, password)
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-sand-light p-6">
            <form
                className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-md flex flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <h3 className="text-xl font-semibold text-ocean-deep">Sign Up</h3>

                <label>Email:</label>
                <input
                    type="email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="p-3 border border-gray-300 rounded focus:outline-none focus:border-ocean-mid focus:ring-ocean-light"
                />

                <label>Password:</label>
                <input
                    type="password"
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="p-3 border border-gray-300 rounded focus:outline-none focus:border-ocean-mid focus:ring-ocean-light"
                />

                <button
                    disabled={isLoading}
                    className="bg-ocean-mid text-sand-light py-2 rounded shadow hover:bg-ocean-deep disabled:opacity-50 transition-all"
                >
                    Sign Up
                </button>

                {localError && <div className="text-red-500 font-medium">{localError}</div>}
                {error && <div className="text-red-500 font-medium">{error}</div>}

                {/* Footer link */}
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
