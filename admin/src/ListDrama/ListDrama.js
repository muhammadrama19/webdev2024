import React, { useState } from "react";
import { Table, Form, Dropdown, ButtonGroup, DropdownButton } from "react-bootstrap";
import "../ListDrama/ListDrama.css"; // Pastikan Anda memiliki file CSS ini

const ListDrama = () => {
  const [filterStatus, setFilterStatus] = useState("Unapproved");
  const [showCount, setShowCount] = useState(10);

  const dramas = [
    {
      id: 1,
      title: "[2024] Japan - Eye Love You",
      actors: "Takuya Kimura, Takeuchi Yuko, Neinen Reina",
      genres: "Romance, Adventures, Comedy",
      synopsis: "I love this drama. It taught me a lot about money and finance. Love is not everything. We need to face the reality too. Being stoic is the best.",
      status: "Unapproved",
    },
    {
      id: 2,
      title: "Rama - Pemuda Ciamis",
      actors: "M. Rama Nurimani",
      genres: "Romance, Adventures, Comedy",
      synopsis: "A lovely boy from Ciamis.",
      status: "Unapproved",
    },
    {
      id: 3,
      title: "Azhar - Pemuda Bekasi",
      actors: "M. Azharuddin Hamid",
      genres: "Romance, Sci-fi, Comedy",
      synopsis: "A backpacker from Bekasi.",
      status: "Unapproved",
    },
    // Tambahkan data lainnya di sini
  ];

  return (
    <div className="list-drama-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <span>Filtered by: </span>
          <DropdownButton
            as={ButtonGroup}
            title={filterStatus}
            variant="light"
            onSelect={(e) => setFilterStatus(e)}
          >
            <Dropdown.Item eventKey="Approved">Approved</Dropdown.Item>
            <Dropdown.Item eventKey="Unapproved">Unapproved</Dropdown.Item>
          </DropdownButton>
        </div>
        <div className="d-flex align-items-center">
          <span className="me-2">Shows</span>
          <Form.Select
            value={showCount}
            onChange={(e) => setShowCount(e.target.value)}
            aria-label="Select show count"
            style={{ width: "100px" }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </Form.Select>
        </div>
        <div>
          <Form.Control
            type="text"
            placeholder="Search"
            className="search-input"
          />
        </div>
      </div>

      <Table striped bordered hover className="drama-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Drama</th>
            <th>Actors</th>
            <th>Genres</th>
            <th>Synopsis</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dramas.slice(0, showCount).map((drama, index) => (
            <tr key={drama.id} className={drama.status === "Unapproved" ? "table-danger" : ""}>
              <td>{index + 1}</td>
              <td>{drama.title}</td>
              <td>{drama.actors}</td>
              <td>{drama.genres}</td>
              <td>{drama.synopsis}</td>
              <td>{drama.status}</td>
              <td>
                <span className="edit-link">Edit</span> | <span className="delete-link">Delete</span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListDrama;
