import React from "react";
import Registration from "./registration";
import Login from "./login";
import { HashRouter, Route, Link } from "react-router-dom";

export default function Welcome() {
    return (
        <HashRouter>
            <div>
                <h1>Welcome!</h1>

                <div>
                    <Route exact path="/" component={Registration} />
                </div>

                <Link to="/login">log in</Link>
            </div>
        </HashRouter>
    );
}
