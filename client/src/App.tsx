import React, { useEffect, useState } from 'react';
import './App.css';
import Contact from './components/Contact';
import { API_SERVER_URL } from './shared/constants.js'
import { IContact } from './shared/models/IContact';

const App: React.FC = () => {
  const [contact, setContact] = useState<IContact | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    fetch(`${API_SERVER_URL}/get-contact/1`).then(resp => {
      resp.json().then(r => {
        setContact(r);
        setLoaded(true);
      }, (err) => { setLoaded(true); })
    }, err => { setLoaded(true);});
  }, [])

  return (
    <>
      <div>
        {contact == null ? 
            !loaded ? <div>Loading!</div>
                    : <div>No such contact!</div>
          : <Contact contact = {contact}></Contact>}
      </div>
    </>
  );
}

export default App;
