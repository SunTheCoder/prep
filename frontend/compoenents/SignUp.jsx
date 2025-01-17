import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../src/redux/userActions";

const SignUp = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const dispatch = useDispatch()
    const { loading, error, user } = useSelector(state => (state.auth))
    
    const handleSignUp = (e) => {
        e.preventDefault();
        dispatch(registerUser(name, email, password))
    }
    return (

        <>
            <form onSubmit={handleSignUp}>
            <input
                type="name"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="email"
                value={email}
                onChange= {(e) => { setEmail(e.target.value)}}
                required
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
            </button>
            
                {error && <p style={{ color: "red" }}>{error}</p>}
                {user && <p style={{ color: "green" }}>Registration successful! Welcome {user.name}</p>}
            
            </form>
        </>

    )
}

export default SignUp