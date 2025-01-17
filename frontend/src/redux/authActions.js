export const login = (email, password) => async (dispatch) => {
    dispatch(loginStart());
    try {
        const response = await fetch("http://localhost:3001/api/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include", //Ensures cookies are sent with request
        })

        const data = response.json();
        if(!response.ok) throw new Error(data.message || "Login Failed");

        dispatch(loginSuccess(data));
    } catch (error) {
        dispatch(loginFailure(error.message));
     }
};