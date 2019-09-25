import React, { useState } from "react";
import axios from "./axios";

export default function Registration() {
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
            .post("/register", user)
            .then(response => {
                console.log("response from server", response);
                if (response.data.id == undefined) {
                    setError(true);
                }
                if (response.data.id) {
                    location.replace(`/app`);
                }
            })
            .catch(err => console.log("error on registering", err));
    };

    return (
        <div className="form-wrapper">
            {error && (
                <div className="error">
                    <div>Registration failed</div>
                </div>
            )}

            <h2>Please register</h2>
            <form className="reglogin-form" onSubmit={handleSubmit}>
                <label htmlFor="first" />
                <input
                    type="text"
                    name="first"
                    placeholder="First name"
                    onChange={handleChange}
                />
                <label htmlFor="last" />
                <input
                    type="text"
                    name="last"
                    placeholder="Last name"
                    onChange={handleChange}
                />
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
