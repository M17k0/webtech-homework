import React from 'react';
import { API_SERVER_URL } from '../shared/constants.js'

export default function Phonevook() {
  return (
    <>
      <div>
        <form action={`${API_SERVER_URL}/image-upload`} method="post" encType="multipart/form-data">
            <input type="file" name="image" accept="image/jpeg,image/png" />
            <button type="submit" name="Upload">Upload</button>
        </form>
      </div>
    </>
  );
}
