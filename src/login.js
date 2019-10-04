import React, { useState } from "react";
import axios from "./axios";

export default function Login() {
    const [user, setUser] = useState({});
    const [error, setError] = useState(false);

    const handleChange = e =>
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });

    const handleSubmit = e => {
        console.log("user before axios", user);
        e.preventDefault();
        axios
            .post("/login", user)
            .then(response => {
                console.log("response from server", response);
                if (response.data == "Your password is wrong.") {
                    setError(true);
                }
                if (typeof response.data == "number") {
                    console.log("you signed in");
                    location.replace(`/app`);
                }
            })
            .catch(err => console.log("error on registering", err));
    };

    return (
        <div className="form-wrapper">
            {error && (
                <div>
                    <div className="error">
                        <div>Logging in failed</div>
                    </div>
                    <div className="modal-overlay"></div>
                </div>
            )}

            <h2>Please sign in</h2>
            <form className="reglogin-form" onSubmit={handleSubmit}>
                <label htmlFor="email" />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />
                <label htmlFor="password" />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />
                <button>Submit</button>
            </form>
        </div>
    );
}
