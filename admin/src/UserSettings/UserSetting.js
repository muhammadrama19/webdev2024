import React, { useState, useEffect } from "react";
import { Container, Table, Form, Button, Modal } from "react-bootstrap";
import { FaPlus, FaEnvelope } from "react-icons/fa";
import "./UserSetting.css";

const UserSetting = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", email: "", role: "User" }); // Tambahkan default role
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mengambil data dari backend saat komponen dirender
  useEffect(() => {
    fetch('http://localhost:8001/users') // Ubah URL sesuai dengan API backend
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Fungsi untuk menutup modal dan reset form new user
  const handleCloseModal = () => {
    setShowModal(false);
    setNewUser({ username: "", email: "", role: "User" }); // Reset form
  };

  // Fungsi untuk menambah user baru
  const handleAddUser = () => {
    const { username, email, role } = newUser;
    if (username.trim() && email.trim() && role.trim()) {
      if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        alert("Email already exists!");
      } else {
        // Mengirim data ke backend
        fetch('http://localhost:8001/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, role }),
        })
          .then((response) => response.json())
          .then((newUserFromBackend) => {
            // Tambahkan user baru ke state
            setUsers([...users, newUserFromBackend]);
            handleCloseModal(); // Tutup modal
          })
          .catch((error) => console.error('Error adding user:', error));
      }
    } else {
      alert("All fields are required!");
    }
  };

  // Fungsi untuk edit user
  const handleEditUser = (id) => {
    const userToEdit = users.find(user => user.id === id);
    setEditing(userToEdit);
  };

  // Fungsi untuk menyimpan perubahan user yang di-edit
  const handleSaveEdit = () => {
    const updatedUser = { ...editing };

    // Mengirim perubahan ke backend
    fetch(`http://localhost:8001/users/${editing.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then(() => {
        // Update state dengan user yang di-edit
        const updatedUsers = users.map(user =>
          user.id === editing.id ? editing : user
        );
        setUsers(updatedUsers);
        setEditing(null); // Keluar dari mode edit
      })
      .catch((error) => console.error('Error updating user:', error));
  };

  // Fungsi untuk menghapus user
  const handleDeleteUser = (id) => {
    // Mengirim permintaan delete ke backend
    fetch(`http://localhost:8001/users/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Hapus user dari state
        setUsers(users.filter(user => user.id !== id));
      })
      .catch((error) => console.error('Error deleting user:', error));
  };

  return (
    <Container>
      <Container className="App">
        <h1 className="title">User Setting</h1>
      </Container>

      {/* Button untuk menampilkan modal */}
      <Button variant="success" className="d-flex align-items-center ms-auto mb-3" onClick={() => setShowModal(true)}>
        <FaPlus className="me-2" />
        Add User
      </Button>

      {/* Modal untuk menambah user baru */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option>User</option>
                <option>Admin</option>
                <option>Editor</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary" style={{ backgroundColor: '#ff5722', borderColor: '#ff5722' }} onClick={handleAddUser}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Tabel user */}
      <Table striped bordered hover className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Role</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>
                {editing && editing.id === user.id ? (
                  <Form.Control
                    type="text"
                    value={editing.username}
                    onChange={(e) => setEditing({ ...editing, username: e.target.value })}
                  />
                ) : (
                  user.username
                )}
              </td>
              <td>
                {editing && editing.id === user.id ? (
                  <Form.Control
                    as="select"
                    value={editing.role}
                    onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  >
                    <option>User</option>
                    <option>Admin</option>
                    <option>Editor</option>
                  </Form.Control>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editing && editing.id === user.id ? (
                  <Form.Control
                    type="email"
                    value={editing.email}
                    onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editing && editing.id === user.id ? (
                  <>
                    <Button variant="success" size="sm" onClick={handleSaveEdit} className="me-2">
                      Save
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setEditing(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="primary" size="sm" className="me-2" onClick={() => handleEditUser(user.id)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" className="me-2" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </Button>
                    <Button variant="link" className="action-button" disabled>
                      <FaEnvelope /> Send Email
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserSetting;
