import React from "react";
import Registration from "./registration";
import Login from "./login";
import { HashRouter, Route, Link } from "react-router-dom";

export default function Welcome() {
    return (
        <HashRouter>
            <div className="welcome-wrapper">
                <img src="https://media-public.canva.com/MAB-qPGeKKc/1/screen-1.svg" />
                <h1>Business card scanner</h1>
                <div className="welcome-container">
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/" component={Registration} />
                </div>
            </div>
        </HashRouter>
    );
}
