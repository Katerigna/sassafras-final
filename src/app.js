import React, { useState } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Scan from "./scan";
import Access from "./access";
import Logout from "./logout";

export default function App() {
    return (
        <BrowserRouter>
            <div className="welcome-wrapper">
                <img
                    src="https://media-public.canva.com/MAB-qPGeKKc/1/screen-1.svg"
                    className="logo"
                />
                <Link to="/logout" />
                <Route exact path="/logout" component={Logout} />
                <div className="welcome-container">
                    <h1>Add business card</h1>

                    <Route exact path="/app" component={Access} />
                    <Route exact path="/scan" component={Scan} />
                </div>
            </div>
        </BrowserRouter>
    );
}
