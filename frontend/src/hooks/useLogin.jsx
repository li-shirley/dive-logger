import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { apiFetch } from '../utils/api'

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)

        const { res, json } = await apiFetch('/api/user/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })

        if (!res.ok) {
            setIsLoading(false);
            setError(json.error);
            return;
        }

        // save user to local storage
        localStorage.setItem('user', JSON.stringify(json))

        // update the auth context
        dispatch({ type: 'LOGIN', payload: json })

        setIsLoading(false)
    }

    return { login, isLoading, error }
}
