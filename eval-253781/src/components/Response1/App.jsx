import React, { useRef } from 'react';
import { FaImage } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';

function MyComponent() {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Selected file:", file.name);
        }
    };

    return (
        <div className="d-flex align-items-center">
            <FaImage size={20} className="me-2 text-muted" />
            <button onClick={handleButtonClick} className="btn btn-light border-0">
                Add Photo
            </button>
            <Form.Control
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
        </div>
    );
}

export default MyComponent;