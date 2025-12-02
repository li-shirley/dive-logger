export const apiFetch = async (
    url,
    options = {},
    { user, refreshToken, dispatch } = {},
    retry = true
) => {
    const headers = {
        'Content-Type': 'application/json',
        ...(user?.token && { Authorization: `Bearer ${user.token}` }),
        ...options.headers,
    };

    const res = await fetch(url, { ...options, headers, credentials: 'include' });

    if (res.status === 401 && retry && refreshToken) {
        const newToken = await refreshToken();
        if (newToken) {
            // Retry original request with new token
            const updatedUser = { ...user, token: newToken };
            return apiFetch(url, options, { user: updatedUser, refreshToken, dispatch }, false);
        }
    }

    const json = await res.json().catch(() => ({}));
    return { res, json };
};
