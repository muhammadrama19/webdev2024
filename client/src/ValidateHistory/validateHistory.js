import React from "react";
import { Container, Table } from 'react-bootstrap';

function ValidateHistory({ validatedDramas }) {
  return (
    <Container>
      <Container className="App">
        <h1 className="title">Validated History</h1>
      </Container>

      {/* Table Section */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ width: '15%' }}>Time</th> {/* Pindahkan kolom waktu ke paling kiri dengan lebar secukupnya */}
            <th>Drama</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {validatedDramas.map((drama, index) => (
            <tr key={index}>
              <td>{drama.time}</td> {/* Tampilkan waktu di kolom pertama */}
              <td>{drama.drama}</td>
              <td>{drama.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ValidateHistory;
