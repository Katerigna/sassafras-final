import React, { useState } from "react";
import axios from "./axios";

export default function Logout() {
    const [loginStatus, setLoginStatus] = useState(true);

    function handleLogout() {
        if (loginStatus) {
            axios.post("/logout").then(response => {
                console.log("logout response", response);
                setLoginStatus(false);
                location.replace("/");
            });
        }
    }

    return (
        <div>
            <img src="logout.png" height="100" />
            <button onClick={handleLogout} className="logout-button">
                Log out
            </button>
        </div>
    );
}
