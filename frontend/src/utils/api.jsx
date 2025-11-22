export async function apiFetch(url, options = {}, dispatch) {
    const response = await fetch(url, options);

    // If token expired or unauthorized:
    if (response.status === 401) {
        // Clear local auth
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });

        alert("Your session has expired. Please log in again.");
        return null;
    }

    return response;
}
