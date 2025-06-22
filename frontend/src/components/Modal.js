import React from 'react';
import './Modal.css'; // style it how you want

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="container-half modal-overlay v-stack-fill" onClick={onClose}>
            <div className='d-flex bg-white p-2'>
                <button className="btn btn-light ms-auto" onClick={onClose}>×</button>
            </div>
            <div className="modal-content v-grow-scroll" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
            <div className='d-flex bg-white p-2'>
                <button className="btn btn-primary ms-auto" onClick={onClose}>Submit</button>
            </div>
        </div>
    );
};

export default Modal;
