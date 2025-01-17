import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { login, logoutUser } from "../redux/userActions";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch()
    const {loading, error} = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(email, password))
        setEmail("")
        setPassword("")
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => {setEmail(e.target.value)}}
                    />       
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    />
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
                <button onClick={() => dispatch(logoutUser())}>Logout</button>
                
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )
};

export default Login