import { useAuthContext } from "./useAuthContext"
import { useDiveContext } from "./useDiveContext"

export const useLogout = () => {
    const {dispatch: authDispact} = useAuthContext()
    const {dispatch: diveDispatch} = useDiveContext()

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch logout action
        authDispact({type: 'LOGOUT'})
        diveDispatch({type: 'SET_DIVES', payload : null})
    }

    return {logout}
}