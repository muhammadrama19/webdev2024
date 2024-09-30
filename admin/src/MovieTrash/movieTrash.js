import React, { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";

const MovieTrash = () => {
  const [trashDramas, setTrashDramas] = useState([]);
  const [loading, setLoading] = useState(true); // Untuk loading state

  // useEffect untuk mengambil movies dengan status 0 (di trash) dari backend
  useEffect(() => {
    const fetchTrashMovies = async () => {
      try {
        const response = await fetch("http://localhost:8001/movie-list?status=0"); // Mengambil movies dengan status 0
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
  

  // Fungsi untuk menghapus secara permanen
  // Fungsi untuk menghapus secara permanen (ubah status menjadi 3)
const handlePermanentDelete = async (id) => {
  try {
    // Lakukan request PUT ke backend untuk mengubah status menjadi 3
    await fetch(`http://localhost:8001/movie-permanent-delete/${id}`, {
      method: 'PUT', // Menggunakan metode PUT untuk soft delete permanen
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 4 }) // Kirim status baru (3) ke backend
    });

    // Update state setelah penghapusan berhasil
    setTrashDramas(trashDramas.filter((drama) => drama.id !== id));
  } catch (error) {
    console.error("Error permanently deleting movie:", error);
  }
};


  // Fungsi untuk mengembalikan movie dari trash (ubah status menjadi 1)
  const handleRestore = async (id) => {
    try {
      // Lakukan request PUT ke backend untuk mengubah status menjadi 1
      await fetch(`http://localhost:8001/movie-restore/${id}`, {
        method: 'PUT', // Ubah status movie menjadi 1
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 1 }) // Kirim status baru (1) ke backend
      });
  
      // Hapus movie dari trashDramas setelah restore berhasil
      setTrashDramas(trashDramas.filter((drama) => drama.id !== id));
    } catch (error) {
      console.error("Error restoring movie:", error);
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
      )}
    </Container>
  );
};

export default MovieTrash;
