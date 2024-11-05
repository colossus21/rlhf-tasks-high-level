import React from "react";
import { FaImage } from "react-icons/fa";
import Form from "react-bootstrap/Form";

function ImageUpload({ handleImageChange }) {
    return (
        <div className="d-flex align-items-center">
            <FaImage size={20} className="me-2 text-muted" />
            <label
                htmlFor="file-upload"
                className="border-0"
                style={{
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    color: "#6c757d",
                    display: "inline-block",
                }}
            >
                Add Photo
            </label>
            <Form.Control
                id="file-upload"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="d-none"
            />
        </div>
    );
}

export default ImageUpload;