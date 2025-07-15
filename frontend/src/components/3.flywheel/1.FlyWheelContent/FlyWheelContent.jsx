// frontend\src\components\3.flywheel\1.FlyWheelContent\FlyWheelContent.jsx
import React, { useState } from 'react';
import './FlyWheelContent.css';


const FlyWheelContent = () => {

  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    // fetch('YOUR_UPLOAD_ENDPOINT', {
    //   method: 'POST',
    //   body: formData,
    //   // headers: { Authorization: 'Bearer YOUR_TOKEN' } // if needed
    // })
    //   .then(res => {
    //     if (!res.ok) throw new Error('403 Forbidden');
    //     return res.json();
    //   })
    //   .catch(err => {
    //     console.error(err);
    //     // handle error, show toast, etc.
    //   });

  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setPreviewURL(URL.createObjectURL(selectedFile));
    } else {
      setPreviewURL(null);
    }
  };


  return (

    <div className="flywheel-container">
      <div className="left-panel">
        <div className="description-box">
            <p className="description">
              The <strong>Flywheel</strong> is a self-reinforcing growth model that drives momentum in a business
              by continuously compounding success over time. In a <strong>Scaling Up coaching business</strong>,
              the flywheel represents the key activities, strategies, and differentiators that, when executed
              consistently, create a cycle of increasing value, client success, and business expansion.
              <br /><br />
              Unlike a linear growth model, the flywheel leverages small, repeated actions that build on each
              other to generate sustained momentum. The core of the flywheel is the <strong>biggest strategic goal or ultimate
              aspiration</strong>, while the surrounding elements represent the critical drivers—such as client acquisition,
              coaching excellence, scalable systems, thought leadership, and community engagement—that fuel
              business acceleration.
              <br /><br />
              When designed effectively, the flywheel ensures that each turn (or iteration) makes future turns
              easier, leading to greater efficiency, impact, and long-term scalability.
            </p>

          <form onSubmit={handleUpload} className="upload-form always-black">
            <label htmlFor="file-upload">Upload File <span className="required">*</span></label>
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              required
            />
            <button type="submit">Upload</button>
          </form>

        </div>
      </div>

      <div className="right-panel">
        {previewURL ? (
          <div className="image-preview">
            <img src={previewURL} alt="Preview" />
          </div>
        ) : (
          <div className="error-box">
            {/* <h3>403 | FORBIDDEN</h3> */}
            <h3>NO PREVIEW</h3>
          </div>
        )}
      </div>
    </div>
  );


};

export default FlyWheelContent;
