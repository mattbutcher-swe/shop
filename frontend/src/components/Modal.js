import React from 'react';
import './Modal.css'; // style it how you want

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="container-half modal-overlay v-stack-fill">
            <div className='d-flex bg-white p-2'>
                <button className="btn btn-light ms-auto" onClick={onClose}>×</button>
            </div>
            {children}
        </div>
    );
};

export default Modal;
