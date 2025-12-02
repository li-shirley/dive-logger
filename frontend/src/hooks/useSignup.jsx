import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { apiFetch } from '../utils/api'

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { dispatch } = useAuthContext()

    const signup = async (email, password) => {
        setIsLoading(true)
        setError(null)

        const { res, json } = await apiFetch('/api/user/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })

        if (!res.ok) {
            setIsLoading(false)
            setError(json.error)
            return
        }

        // save user to local storage
        localStorage.setItem('user', JSON.stringify(json))

        // update the auth context
        dispatch({ type: 'LOGIN', payload: json })

        setIsLoading(false)
    }

    return { signup, isLoading, error }
}
