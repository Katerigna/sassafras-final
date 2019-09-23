import React, { useState } from "react";
import axios from "./axios";

export default function Registration() {
    const [user, setUser] = useState({});

    function handleChange(e) {
        console.log("input first name", e.target.value);
        console.log("input key", e.target.name);
        setUser({
            [e.target.name]: e.target.value
        });
        console.log("user: ", user);
    }

    return (
        <div>
            <h2>Please register</h2>
            <form className="registration-form">
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
