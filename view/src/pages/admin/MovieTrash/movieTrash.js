// MovieTrash.js
import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";

const  apiUrl = process.env.REACT_APP_API_URL;

const MovieTrash = () => {
  const [trashDramas, setTrashDramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(null); // "restore" or "delete"
  const [selectedDrama, setSelectedDrama] = useState(null);

  // useEffect untuk mengambil movies dengan status 0 (di trash) dari backend
  useEffect(() => {
    const fetchTrashMovies = async () => {
      try {
        const response = await fetch(`${apiUrl}/movie-list?status=0`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setTrashDramas(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trash movies:", error);
        setLoading(false);
      }
    };
  
    fetchTrashMovies();
  }, []);
  
  // Function to handle action with confirmation modal
  const handleAction = (id, type) => {
    setSelectedDrama(id);
    setActionType(type);
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    try {
      if (actionType === "restore") {
        const response = await fetch(`${apiUrl}/movie-restore/${selectedDrama}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 1 }) // Mengubah status menjadi 1
        });
        if(response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Movie restored successfully.",
          });
        setTrashDramas(trashDramas.filter((drama) => drama.id !== selectedDrama));}
        else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to restore movie.",
          });
        } 
      } else if (actionType === "delete") {
        const response = await fetch(`${apiUrl}/movie-permanent-delete/${selectedDrama}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 4 }) // Mengubah status menjadi 4
        });
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Movie deleted successfully.",
          });
          setTrashDramas(trashDramas.filter((drama) => drama.id !== selectedDrama));
        }
        else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete movie.",
          });
        }
      }
    } catch (error) {
      console.error(`Error ${actionType === "restore" ? "restoring" : "deleting"} movie:`, error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to ${actionType === "restore" ? "restore" : "delete"} movie.`,
      });
    } finally {
      setShowConfirmModal(false);
      setSelectedDrama(null);
      setActionType(null);
    }
  };

  return (
    <Container>
      <Container className="App">
        <h1 className="title">Movies Trash</h1>
      </Container>

      {loading ? (
        <p>Loading trash data...</p>
      ) : (
        <div className="drama-table-wrapper">
          <Table striped bordered hover className="drama-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Drama</th>
                <th>Actors</th>
                <th>Genres</th>
                <th style={{ width: "250px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {trashDramas.map((drama, index) => (
                <tr key={drama.id}>
                  <td>{index + 1}</td>
                  <td>{drama.title}</td>
                  <td>{drama.Actors}</td>
                  <td>{drama.Genres}</td>
                  <td>
                    <div className="action-buttons d-flex justify-content-center">
                      <Button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleAction(drama.id, "restore")}
                        style={{ marginRight: "10px" }}
                      >
                        Restore
                      </Button>
                      <Button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleAction(drama.id, "delete")}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {trashDramas.length === 0 && (
            <p className="text-center mt-3">There's no movies in trash.</p>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Confirm {actionType === "restore" ? "Restore" : "Delete"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {actionType === "restore" ? "restore" : "delete"} this movie?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button
            variant={actionType === "restore" ? "warning" : "danger"}
            onClick={confirmAction}
          >
            {actionType === "restore" ? "Restore" : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MovieTrash;
