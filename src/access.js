import React, { useState } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Scan from "./scan";

export default function Access() {
    const [permission, setPermission] = useState(true);

    function handleClick() {
        setPermission(false);
    }

    return (
        <BrowserRouter>
            <div className="welcome-wrapper">
                <div className="welcome-container">
                    {permission && (
                        <div className="modal modal-permission">
                            <p>Please allow access to your camera</p>

                            <Link to="/scan" className="modal-permission">
                                <button onClick={handleClick}>OK</button>
                            </Link>
                        </div>
                    )}
                    <Route exact path="/scan" component={Scan} />
                </div>
            </div>
        </BrowserRouter>
    );
}
