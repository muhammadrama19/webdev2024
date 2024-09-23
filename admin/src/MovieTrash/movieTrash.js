import React from "react";
import { Container, Table, Button } from "react-bootstrap";

const MovieTrash = ({ trashDramas, setTrashDramas, dramas, setDramas }) => {
  const handlePermanentDelete = (id) => {
    setTrashDramas(trashDramas.filter((drama) => drama.id !== id)); // Hapus secara permanen dari trash
  };

  const handleRestore = (id) => {
    const restoredDrama = trashDramas.find((drama) => drama.id === id);
    setDramas([...dramas, restoredDrama]); // Tambahkan movie ke ListDrama
    setTrashDramas(trashDramas.filter((drama) => drama.id !== id)); // Hapus dari trash
  };

  return (
    <Container>
      <Container className="App">
        <h1 className="title">Movies Trash</h1>
      </Container>

      <div className="drama-table-wrapper">
        <Table striped bordered hover className="drama-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Drama</th>
              <th>Actors</th>
              <th>Genres</th>
              <th style={{ width: "250px" }}>Action</th> {/* Lebarkan kolom Action menjadi 250px */}
            </tr>
          </thead>
          <tbody>
            {trashDramas.map((drama, index) => (
              <tr key={drama.id}>
                <td>{index + 1}</td>
                <td>{drama.title}</td>
                <td>{drama.actors}</td>
                <td>{drama.genres}</td>
                <td>
                  {/* Gunakan flexbox untuk merapikan tata letak tombol */}
                  <div className="action-buttons d-flex justify-content-center">
                    <Button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleRestore(drama.id)}
                      style={{ marginRight: "10px" }} 
                    >
                      Restore
                    </Button>
                    <Button
                      className="btn btn-sm btn-danger"
                      onClick={() => handlePermanentDelete(drama.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default MovieTrash;
