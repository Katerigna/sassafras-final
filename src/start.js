import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";

let elem;

if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <p>logo</p>;
}

ReactDOM.render(
    elem, //JSX element
    document.querySelector("main")
);

//component, JSX component
function HelloWorld() {
    return <div>Hello, World!</div>;
}
