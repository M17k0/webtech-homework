import React, { useRef, useState, useEffect } from 'react';
import { API_SERVER_URL } from '../shared/constants.js'
import { IContact } from '../shared/models/IContact.js';
import defaultImage from '../user_profile.png';

interface ContactProfileProps {
  contact: IContact;
}

const Contact: React.FC<ContactProfileProps> = ({ contact }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [photoUrl, setPhotoUrl] = useState<string | null>(contact.imageUrl);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); 
  
  const fileInput = useRef<HTMLInputElement>(null);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      setSelectedImage(event.target.files[0]);
      setImagePreviewUrl(window.URL.createObjectURL(event.target.files[0]));
    } else {
      setSelectedImage(null);
      setImagePreviewUrl(null);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedImage) {
      setErrorText("No image selected!");
      return;
    }

    setErrorText(null);
    
    const formData = new FormData();
    formData.append('image', selectedImage);

    fetch(`${API_SERVER_URL}/update-contact-photo/${contact.id}`, {
      method: 'POST',
      body: formData,
    }).then(resp => {
      resp.json().then(r => {
        setPhotoUrl(r.imageUrl);
        if (fileInput.current) {
          fileInput.current.value = '';
          setImagePreviewUrl(null);
        }
      }, (err) => { setErrorText("Photo upload failed!"); })
    }, err => { setErrorText("Photo upload failed!"); });
  };

  return (
    <div>
      <h2>Contact</h2>
      <div>
        { photoUrl != null 
          ? <img src={photoUrl} alt="Contact image" style={{ maxWidth: '500px', maxHeight: '500px', width: '100%', height: '100%' }}/> 
          : <img src={defaultImage} alt="Contact image" style={{ maxWidth: '500px', maxHeight: '500px', width: '100%', height: '100%' }}/>}
        <p>Name: {contact.name}</p>
        <p>Phone Number: {contact.phoneNumber}</p>
      </div>
      <form onSubmit={onSubmit}>
        <input ref={fileInput} type="file" name="image" accept="image/jpeg,image/png" onChange={onImageChange} />
        <button type="submit">Upload</button>
        { errorText ? <span style={{ color: 'red' }}>{errorText}</span> : <></>}
      </form>
      <div>
        { imagePreviewUrl != null ? <img src={imagePreviewUrl} alt="Preview image" style={{ maxWidth: '500px', maxHeight: '500px', width: '100%', height: '100%' }} /> : <></>}
      </div>
    </div>
  );
};

export default Contact;