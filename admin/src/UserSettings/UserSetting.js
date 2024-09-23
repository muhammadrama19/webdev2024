import React, { useState } from "react";
import { Container, Table, Form, Button, Modal } from "react-bootstrap";
import { FaPlus, FaEnvelope } from "react-icons/fa";
import "./UserSetting.css";

const UserSetting = () => {
  const [users, setUsers] = useState([
    { id: 1, username: "anita1", email: "anita@gmail.com", role: "Admin" },
    { id: 2, username: "borang", email: "bora@yahoo.com", role: "User" },
  ]);

  const [newUser, setNewUser] = useState({ username: "", email: "", role: "User" }); // Tambahkan default role
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewUser({ username: "", email: "", role: "User" }); // Reset role to default
  };

  const handleAddUser = () => {
    const { username, email, role } = newUser;
    if (username.trim() && email.trim() && role.trim()) {
      if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        alert("Email already exists!");
      } else {
        setUsers([
          ...users,
          {
            id: users.length + 1,
            username: username.trim(),
            email: email.trim(),
            role: role.trim(),
          },
        ]);
        handleCloseModal();
      }
    } else {
      alert("All fields are required!");
    }
  };

  const handleEditUser = (id) => {
    const userToEdit = users.find(user => user.id === id);
    setEditing(userToEdit);
  };

  const handleSaveEdit = () => {
    const updatedUsers = users.map(user =>
      user.id === editing.id ? { ...user, username: editing.username, email: editing.email, role: editing.role } : user
    );
    setUsers(updatedUsers);
    setEditing(null);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <Container>
      <Container className="App">
        <h1 className="title">User Setting</h1>
      </Container>
      <Button variant="success" className="d-flex align-items-center ms-auto mb-3" onClick={handleShowModal}>
        <FaPlus className="me-2" />
        Add User
      </Button>
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
          <Button type="submit" variant="primary" style={{ backgroundColor: '#ff5722', borderColor: '#ff5722' }}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Table striped bordered hover className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Role</th> {/* Kolom baru untuk Role */}
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
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleSaveEdit}
                      className="me-2"
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditUser(user.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="link"
                      className="action-button"
                      disabled
                    >
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
