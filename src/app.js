import React from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Scan from "./scan";

export default function App() {
    return (
        <BrowserRouter>
            <div className="welcome-wrapper">
                <img src="https://media-public.canva.com/MAB-qPGeKKc/1/screen-1.svg" />
                <div className="welcome-container">
                    <h1>Add business card</h1>

                    <Route path="/scan" component={Scan} />

                    <Link to="/scan">Scan</Link>
                </div>
            </div>
        </BrowserRouter>
    );
}
