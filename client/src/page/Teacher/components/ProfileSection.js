import React from 'react';
import { Camera, CheckCircle } from 'lucide-react';
import ImageUploader from 'react-image-upload';

const ProfileSection = ({
  profileInfo,
  teacherUser,
  showUploader,
  setShowUploader,
  onImageUpload,
  profileFile,
  uploadLoading
}) => {
  return (
    <div className="text-center">
      <div className="profile-image-container mb-4">
        {profileInfo?.ProfilePic && !showUploader ? (
          <div className="position-relative">
            <img
              src={profileInfo.ProfilePic.url}
              alt="Profile"
              className="profile-image"
              onDoubleClick={() => setShowUploader(true)}
            />
            <div className="profile-image-overlay">
              <Camera size={32} color="white" />
            </div>
          </div>
        ) : (
          <div className="w-100">
            <ImageUploader onFileAdded={(img) => onImageUpload(img)} />
            {Object.keys(profileFile).length > 0 && (
              <button
                onClick={onImageUpload}
                disabled={uploadLoading}
                className="btn btn-primary mt-3 w-100"
              >
                {uploadLoading ? 'Uploading...' : 'Upload Picture'}
              </button>
            )}
          </div>
        )}
        {teacherUser?.isTeacherVerified && (
          <div className="verified-badge">
            <CheckCircle size={16} />
          </div>
        )}
      </div>

      <h1 className="h3 mb-3">{profileInfo?.FullName || 'N/A'}</h1>
      <p className="text-muted mb-2">{teacherUser?.Email || 'N/A'}</p>
      <p className="text-muted mb-4">{profileInfo?.ContactNumber || 'N/A'}</p>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="info-card">
            <small className="text-muted d-block">Date of Birth</small>
            <strong>{profileInfo?.DOB || 'N/A'}</strong>
          </div>
        </div>
        <div className="col-md-6">
          <div className="info-card">
            <small className="text-muted d-block">Gender</small>
            <strong>{profileInfo?.Gender || 'N/A'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;