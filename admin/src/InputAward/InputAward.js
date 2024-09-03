import React, { useState } from 'react';
import { Container, Table, Form, Button } from 'react-bootstrap';


function AwardsManager() {
    const [entries, setEntries] = useState([
        { country: 'Japan', year: '2024', award: 'Japanese Drama Awards Spring 2024' },
        { country: 'Korea', year: '2024', award: 'Korean Drama Awards Winter 2024' },
        { country: 'USA', year: '2023', award: 'American Music Awards 2023' },
    ]);

    const [form, setForm] = useState({ country: '', year: '', award: '' });
    const [editIndex, setEditIndex] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editIndex !== null) {
            const updatedEntries = [...entries];
            updatedEntries[editIndex] = form;
            setEntries(updatedEntries);
            setEditIndex(null);
        } else {
            setEntries([...entries, form]);
        }

        setForm({ country: '', year: '', award: '' });
    };

    const handleEdit = (index) => {
        setForm(entries[index]);
        setEditIndex(index);
    };

    const handleDelete = (index) => {
        setEntries(entries.filter((_, i) => i !== index));
    };

    return (
        <Container className="mt-5">
            {/* Form Section */}
            <Form onSubmit={handleSubmit} className="mb-4">
                <div className="row g-3">
                    <div className="col-md-4">
                        <label htmlFor="country" className="form-label">Country</label>
                        <input
                            type="text"
                            className="form-control"
                            id="country"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            placeholder="Enter country"
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="year" className="form-label">Year</label>
                        <input
                            type="number"
                            className="form-control"
                            id="year"
                            name="year"
                            value={form.year}
                            onChange={handleChange}
                            placeholder="Enter year"
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="award" className="form-label">Awards</label>
                        <input
                            type="text"
                            className="form-control"
                            id="award"
                            name="award"
                            value={form.award}
                            onChange={handleChange}
                            placeholder="Enter award"
                            required
                        />
                    </div>
                </div>
                <div className="mt-3">
                    <Button type="submit" className="btn btn-warning" style={{ backgroundColor: '#ff5722', borderColor: '#ff5722' }}>
                        {editIndex !== null ? 'Update' : 'Submit'}
                    </Button>
                </div>
            </Form>

            {/* Table Section */}
            <Table className="table table-striped" striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Countries</th>
                        <th>Years</th>
                        <th>Awards</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{entry.country}</td>
                            <td>{entry.year}</td>
                            <td>{entry.award}</td>
                            <td>
                                <Button
                                    className="btn btn-sm btn-primary me-2"
                                    onClick={() => handleEdit(index)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(index)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default AwardsManager;
