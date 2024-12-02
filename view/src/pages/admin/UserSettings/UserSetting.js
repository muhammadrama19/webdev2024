import React, { useState, useEffect } from "react";
import { Container, Table, Form, Button, Modal, Pagination, Dropdown, Col, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import "./UserSetting.scss";
import Swal from "sweetalert2";

const  apiUrl = process.env.REACT_APP_API_URL;

const UserSetting = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "User" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCount, setShowCount] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false); // Tambahkan state untuk mode edit
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [typeConfirm, setTypeConfirm] = useState("");


  useEffect(() => {
    fetch(`${apiUrl}/users`, {
      method: 'GET',
      credentials: 'include', // Add credentials include
    })
      .then((response) => response.json())
      .then((data) => {
        // Check if the data is an array and set it to the users state
        if (Array.isArray(data)) {
          setUsers(data);  // Set users to the array of users
        } else {
          console.error('Expected an array of users but got:', data);
        }
      })
      .catch((error) => console.error('Error fetching users:', error));

    setLoading(false);  // Assuming you are setting the loading state here
  }, []);

  // Fungsi validasi
  const validateForm = () => {
    const { username, email, password } = newUser;

    // 1. Validasi username: cek apakah sudah ada
    if (users.some(user => user.username.toLowerCase() === username.toLowerCase() && !isEditMode)) {
      setErrorMessage("Username already exists!");
      return false;
    }

    // 2. Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Format email dengan '@'
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format!");
      return false;
    }
    if (users.some(user => user.email.toLowerCase() === email.toLowerCase() && !isEditMode)) {
      setErrorMessage("Email already exists!");
      return false;
    }

    // 3. Validasi password (Hanya saat tambah, tidak saat edit)
    if (!isEditMode) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/; // Harus ada 1 uppercase, 1 simbol, min 8 karakter
      if (!passwordRegex.test(password)) {
        setErrorMessage("Password must be at least 8 characters long, with one uppercase and one symbol.");
        return false;
      }
    }

    setErrorMessage(""); // Reset error message if validation passes
    return true;
  };

  const handleAddUser = () => {
    if (!validateForm()) {
      return;
    }

    const { username, email, password, role } = newUser;
    if (username.trim() && email.trim() && password.trim() && role.trim()) {
      fetch(`${apiUrl}/users`, {
        method: 'POST',
        credentials: 'include', // Add credentials include
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }),
      })
        .then((response) => response.json())
        .then((newUserFromBackend) => {
          setUsers([...users, newUserFromBackend]);
          handleCloseModal(); // Tutup modal
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "User has been created succesfully",
            timer: 2000
          })
          window.location.reload();
        })
        .catch((error) => console.error('Error adding user:', error));
    } else {
      Swal.fire({
        icon: "error",
        title: "All field are required ",
        text: "Please filll all required field!",
        timer: 2000
      })
    }
  };

  const handleEditUserSubmit = () => {
    if (!validateForm()) {
      return;
    }

    fetch(`${apiUrl}/users/${selectedUser.id}`, {
      method: 'PUT',
      credentials: 'include', // Add credentials include
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then(() => {
        const updatedUsers = users.map(user =>
          user.id === selectedUser.id
            ? { ...user, ...newUser, Status_Account: user.Status_Account } // Tambahkan Status_Account
            : user
        );
        setUsers(updatedUsers);
        Swal.fire({
          icon: "success",
          title: "User successfully edited",
          text: "The user has been successfully updated",
        });
      })
      .catch((error) => console.error('Error updating user:', error));
    Swal.fire({
      icon: "error",
      title: "Failed to delete User",
      text: "An error occurred while deleting the award. Please try again later or check relations in the database.",
    });
    handleCloseModal();
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/delete/${selectedUser.id}`, {
        method: 'PUT',
        credentials: 'include', // Add credentials include
      });
      if (response.ok) {
        const updatedUsers = users.map(user =>
          user.id === selectedUser.id ? { ...user, Status_Account: 3 } : user
        );
        setUsers(updatedUsers);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User deleted successfully',
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to delete user!',
          text: 'An error occurred while deleting the user. Please try again later or check relations in the database.',
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to delete award!',
        text: 'An error occurred while deleting the award. Please try again later or check relations in the database.',
        timer: 3000,
      });
    }
    setShowConfirmModal(false);
    setSelectedUser(null);
  };

  const handleSuspendUser = () => {
    fetch(`${apiUrl}/users/suspend/${selectedUser.id}`, {
      method: 'PUT',
      credentials: 'include', // Add credentials include
    })
      .then((response) => response.json())
      .then(() => {
        const updatedUsers = users.map(user =>
          user.id === selectedUser.id ? { ...user, Status_Account: 2 } : user
        );
        setUsers(updatedUsers);
        setShowConfirmModal(false);
        setSelectedUser(null);
        Swal.fire({
          icon: "success",
          title: "Users Suspended",
          text: "Users Suspended succesfully!",
          timer: 2000
        })
      })
      .catch((error) => console.error('Error suspending user:', error));
  };

  const handleUnlockUser = () => {
    fetch(`${apiUrl}/users/unlock/${selectedUser.id}`, {
      method: 'PUT',
      credentials: 'include', // Add credentials include
    })
      .then((response) => response.json())
      .then(() => {
        const updatedUsers = users.map(user =>
          user.id === selectedUser.id ? { ...user, Status_Account: 1 } : user
        );
        setUsers(updatedUsers);
        setShowConfirmModal(false);
        setSelectedUser(null);
        Swal.fire({
          icon: "success",
          title: "Users unsuspended",
          text: "Users unsuspended succesfully!",
          timer: 2000
        })
      })
      .catch((error) => console.error('Error unlocking user:', error));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewUser({ username: "", email: "", password: "", role: "User" });
    setErrorMessage(""); // Reset error message
    setIsEditMode(false); // Reset ke mode tambah setelah modal ditutup
  };

  const handleEditUser = (user) => {
    setIsEditMode(true); // Set ke mode edit
    setNewUser({ username: user.username, email: user.email, password: "", role: user.role });
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleConfirmation = (user) => {
    setShowConfirmModal(true);
    setSelectedUser(user);
  };

  const filteredUsers = users.filter((user) =>
    user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * showCount;
  const indexOfFirstUser = indexOfLastUser - showCount;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / showCount);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    let items = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
          {number}
        </Pagination.Item>
      );
    }
    return (
      <div className="d-flex justify-content-end">
        <Pagination>
          <Pagination.First onClick={() => setCurrentPage(1)} />
          <Pagination.Prev onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)} />
          {items}
          <Pagination.Next onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)} />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
        </Pagination>
      </div>
    );
  };

  return (
    <Container>
      <Container className="App">
        <h1 className="title">User Setting</h1>
      </Container>

      <Container className="list-drama-header d-flex justify-content-between mb-3">
        <Container className="d-flex">
          <Col xs="auto" className="d-flex me-3">
            <Dropdown onSelect={setShowCount}>
              <Dropdown.Toggle variant="light" id="dropdown-show">
                Shows: {showCount}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {[10, 20, 50].map((count) => (
                  <Dropdown.Item key={count} eventKey={count}>
                    {count}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Container>

        {/* Button to Add New User */}
        <Button
          variant="success"
          className="d-flex align-items-center w-auto px-4 py-2"
          style={{ whiteSpace: 'nowrap' }}
          onClick={() => {
            setShowModal(true);
            setIsEditMode(false); // Set ke mode tambah saat klik Add New User
          }}>
          <FaPlus className="me-2" />
          Add New User
        </Button>
      </Container>

      {/* Modal untuk menambah atau edit user */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit User" : "Add New User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => { e.preventDefault(); isEditMode ? handleEditUserSubmit() : handleAddUser(); }}>
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
            {!isEditMode && (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option>User</option>
                <option>Admin</option>
              </Form.Control>
            </Form.Group>
          </Form>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary" style={{ backgroundColor: '#ff5722', borderColor: '#ff5722' }} onClick={isEditMode ? handleEditUserSubmit : handleAddUser}>
            {isEditMode ? "Save Changes" : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {typeConfirm === "delete" && "Confirm Delete"}
            {typeConfirm === "suspend" && "Confirm Suspend"}
            {typeConfirm === "unlock" && "Confirm Unlock"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {typeConfirm === "delete" && "Are you sure you want to delete the user?"}
          {typeConfirm === "suspend" && "Are you sure you want to suspend this user?"}
          {typeConfirm === "unlock" && "Are you sure you want to unlock this user?"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          {typeConfirm === "delete" && (
            <Button variant="danger" onClick={handleDeleteUser}>
              Delete
            </Button>
          )}
          {typeConfirm === "suspend" && (
            <Button variant="warning" onClick={handleSuspendUser}>
              Suspend
            </Button>
          )}
          {typeConfirm === "unlock" && (
            <Button variant="success" onClick={handleUnlockUser}>
              Unlock
            </Button>
          )}
        </Modal.Footer>
      </Modal>


      {loading ? (
        <Spinner animation="border" variant="primary" style={{ display: 'block', margin: '0 auto' }} />

      ) : (
        <>
          <Table striped bordered hover className="user-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Username</th>
                <th>Role</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{(currentPage - 1) * showCount + index + 1}</td> {/* Hitung nomor urut berdasarkan halaman */}
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>{user.Status_Account === 1 ? "Active" : user.Status_Account === 2 ? "Suspended" : "Deleted"}</td>
                  <td>
                    <Container className="action-button">
                      {user.Status_Account === 2 ? (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => {
                              handleConfirmation(user);
                              setTypeConfirm("unlock");
                            }}
                          >
                            Unlock
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            className="me-2"
                            onClick={() => {
                              handleEditUser(user);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => {
                              handleConfirmation(user);
                              setTypeConfirm("suspend");
                            }}
                          >
                            Suspend
                          </Button>
                        </>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          handleConfirmation(user);
                          setTypeConfirm("delete");
                        }}
                      >
                        Delete
                      </Button>
                    </Container>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {renderPagination()}
        </>
      )}
    </Container>
  );
};

export default UserSetting;
