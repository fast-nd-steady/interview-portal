import React from "react";

function Header(props) {
    return (
        <div className="container my-4 bg-primary text-white p-4 bg-opacity-75">
            <h1> Welcome , {props.adminName} ...</h1>
        </div>
    );
}

export default Header;