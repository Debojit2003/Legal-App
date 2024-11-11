import React, { useState } from "react";
import cloudComputing from "../assets/images/cloud-computing.png";
import { getFirestore, doc, updateDoc } from "firebase/firestore"; // Firestore functions
import { getAuth } from "firebase/auth"; // Firebase Authentication
import "./FileUpload.css";

const FileUpload = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploading(true);
    setError(null); // Reset error if file changes

    const data = new FormData();
    data.append("file", selectedFile);
    data.append("upload_preset", "sdhgimkh"); // Swapped preset
    data.append("cloud_name", "dapyza9xq"); // Swapped cloud name

    const fileType = selectedFile.type;

    try {
      let response;
      // For image files (e.g., bail papers with images)
      if (fileType.startsWith("image/")) {
        response = await fetch(
          "https://api.cloudinary.com/v1_1/dapyza9xq/image/upload", // Swapped cloud name
          {
            method: "POST",
            body: data,
          }
        );
      }
      // For PDF files (e.g., legal documents or bail papers)
      else if (fileType === "application/pdf") {
        response = await fetch(
          "https://api.cloudinary.com/v1_1/dapyza9xq/raw/upload", // Swapped cloud name
          {
            method: "POST",
            body: data,
          }
        );
      } else {
        setError("Unsupported file type. Please upload an image or a PDF.");
        setUploading(false);
        return;
      }

      const result = await response.json();

      if (response.ok) {
        const uploadedUrl = result.secure_url;
        setUploadedUrl(uploadedUrl);
        if (onUploadComplete) {
          onUploadComplete(uploadedUrl); // Pass the URL back to the parent if defined
        }
        console.log("Bail paper uploaded to Cloudinary:", uploadedUrl);
        setUploadSuccess(true);

        // Now update Firestore with the uploaded URL
        await updateFamilyMemberFileUrl(uploadedUrl);
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Function to update the Firestore family member document with the uploaded file URL
  const updateFamilyMemberFileUrl = async (uploadedUrl) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      // Assuming the family member ID is associated with the currently logged-in user
      const familyMemberId = user.uid; // Use user's UID as the family member ID or retrieve as needed
      const db = getFirestore();
      const familyMemberRef = doc(db, "family_member", familyMemberId); // Reference to the Firestore document

      try {
        await updateDoc(familyMemberRef, {
          bail_consideration: uploadedUrl, // Store the URL in the bail_consideration field
        });
        console.log("Firestore updated successfully!");
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    } else {
      setError("User is not authenticated.");
    }
  };

  return (
    <div className="file-upload-container">
      <h2 className="file-upload-title">Upload Bail Paper (Image/PDF)</h2>
      <label className="file-upload">
        <img src={cloudComputing} alt="Upload Icon" width={50} height={50} />
        <input type="file" onChange={handleFileChange} />
        <span>{file ? file.name : "Choose Bail Paper"}</span>
      </label>
      {uploading && <p>Uploading...</p>}
      {error && <p className="error-message">{error}</p>}
      {uploadSuccess && uploadedUrl && (
        <p>
          File uploaded successfully!{" "}
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
            View Uploaded File
          </a>
        </p>
      )}
    </div>
  );
};

export default FileUpload;
