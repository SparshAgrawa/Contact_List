import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ContactList.css";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [editContact, setEditContact] = useState(null);
  const [error, setError] = useState(""); 

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    setContacts(response.data);
    console.error("Error fetching contacts:", error);
  };

  const handleChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditContact({ ...editContact, [e.target.name]: e.target.value });
  };

  const handleAddContact = async () => {
    if (!/^\d{10}$/.test(newContact.phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    const response = await axios.post(
      "https://jsonplaceholder.typicode.com/users",
      newContact
    );
    setContacts([...contacts, response.data]);
    setNewContact({ name: "", phone: "" });
    console.error("Error adding contact:", error);
  };

  const handleUpdatedContact = async () => {
    if (!/^\d{10}$/.test(editContact.phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    const response = await axios.put(
      `https://jsonplaceholder.typicode.com/users/${editContact.id}`,
      editContact
    );
    setContacts(
      contacts.map((contact) =>
        contact.id === response.data.id ? response.data : contact
      )
    );
    setEditContact(null);
    setError(""); 
    console.error("Error updating contact:", error);
  };

  const handleDeleteContact = async (id) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
    setContacts(contacts.filter((contact) => contact.id !== id));
    console.error("Error deleting contact:", error);
  };

  return (
    <div className="contact-list">
      <h1>Contact List</h1>
      <div className="form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newContact.name}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone (10 digits)"
          value={newContact.phone}
          onChange={handleChange}
          pattern="\d{10}"
          title="Phone number must be exactly 10 digits."
        />
        <button className="add" onClick={handleAddContact}>
          Add Contact
        </button>
        {error && <p className="error">{error}</p>}
      </div>
      {editContact && (
        <div className="form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={editContact.name}
            onChange={handleEditChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone (10 digits)"
            value={editContact.phone}
            onChange={handleEditChange}
            pattern="\d{10}"
            title="Phone number must be of 10 digits."
          />
          <button className="update" onClick={handleUpdatedContact}>
            Update Contact
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <span>
              {contact.name} - {contact.phone}
            </span>
            <div className="buttons">
              <button
                className="update"
                onClick={() => setEditContact(contact)}
              >
                Edit
              </button>
              <button
                className="delete"
                onClick={() => handleDeleteContact(contact.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
