import React from "react";
import "../../css/modal.css";
import DataUtilityAdmin from "./DataUtilityAdmin"

function Modal({ setOpenModal, Card, appName, handleSubmit }) {




    return (
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="modalBody">
                    <Card />
                </div>
            </div>
        </div>
    );
}

export default Modal;