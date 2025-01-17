import { loginStart, loginSuccess, loginFailure } from "./authSlice";

const API_URL = "http://localhost:3001/api/auth"; //Update with backend URL

export const login = (email, password) => async (dispatch) => {
    dispatch(loginStart());
    try {
        const reponse = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),
            creadentials: "include", //ensures cookies
            
        })
        const data = await reponse.json();

        if(!reponse.ok) throw new Error(error.message || "Login Failed")
        console.log("login successful:", data)
        dispatch(loginSuccess(data))
    } catch (error) {
        dispatch(loginFailure(error.message))
    }

}