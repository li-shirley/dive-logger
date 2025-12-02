/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        case 'REFRESH_TOKEN':
            return { user: { ...state.user, token: action.payload } };
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
    });
    const [loading, setLoading] = useState(true);

    // Attempt to refresh token on initial load
    useEffect(() => {
        const initAuth = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                dispatch({ type: 'LOGIN', payload: storedUser });
                try {
                    const refreshedToken = await refreshToken();
                    if (refreshedToken) {
                        dispatch({ type: 'REFRESH_TOKEN', payload: refreshedToken });
                    } else {
                        dispatch({ type: 'LOGOUT' });
                    }
                } catch (err) {
                    console.log(err);
                    dispatch({ type: 'LOGOUT' });
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    // Refresh token function
    const refreshToken = async () => {
        try {
            const res = await fetch('/api/user/refresh', {
                method: 'POST',
                credentials: 'include', // sends httpOnly cookie
            });
            const json = await res.json();

            if (res.ok) {
                const user = JSON.parse(localStorage.getItem('user')) || {};
                const updatedUser = { ...user, token: json.token };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                dispatch({ type: 'REFRESH_TOKEN', payload: json.token });
                return json.token;
            } else {
                dispatch({ type: 'LOGOUT' });
                localStorage.removeItem('user');
                return null;
            }
        } catch (err) {
            console.error("Refresh token failed", err);
            dispatch({ type: 'LOGOUT' });
            localStorage.removeItem('user');
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ ...state, dispatch, loading, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};
