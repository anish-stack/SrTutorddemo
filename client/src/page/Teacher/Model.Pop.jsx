import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import './ModelPop.css';

const ModelPop = ({ isOpen=true }) => {
    const [isModalOpen, setIsModalOpen] = useState(isOpen); 

    if (!isModalOpen) return null;
  
    const handleUpload = () => {
      window.location.hash = "#Document";
      setIsModalOpen(false); 
    };
  
    const handleClose = () => {
      setIsModalOpen(false);
    };

  return (
    <div className="xustom-modal-overlay">
      <div className="xustom-modal-container">
        <div className="xustom-modal-content">
          <div className="xustom-modal-header">
            <h5 className="xustom-modal-title">Document Verification</h5>
            {/* <button className="xustom-close-button" onClick={handleClose}>
              <X size={24} />
            </button> */}
          </div>
          
          <div className="xustom-modal-body">
            <img 
              src="https://img.freepik.com/free-vector/stock-exchange-data-concept_23-2148583922.jpg"
              alt="Document Upload"
              className="xustom-hero-image mb-4"
            />
            
            <div className="text-center">
              <h4 className="mb-3">Ready to Get Started?</h4>
              <p className="text-muted mb-4">
                Upload your documents to begin receiving student leads
              </p>
              <button 
                className="btn btn-primary d-flex align-items-center mx-auto"
                onClick={handleUpload}
              >
                <Upload size={20} className="me-2" />
                Upload Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPop;