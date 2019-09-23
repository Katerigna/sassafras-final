import React from "react";
import Registration from "./registration";
import Login from "./login";
import { HashRouter, Route, Link } from "react-router-dom";

export default function Welcome() {
    return (
        <HashRouter>
            <div className="welcome-wrapper">
                <img src="https://media-public.canva.com/MAB-qPGeKKc/1/screen-1.svg" />
                <div className="welcome-container">
                    <h1>Welcome!</h1>

                    <Route path="/login" component={Login} />
                    <Route exact path="/" component={Registration} />

                    <p>or</p>
                    <Link to="/login">Log in</Link>
                </div>
            </div>
        </HashRouter>
    );
}
