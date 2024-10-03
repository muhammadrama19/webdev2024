import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ isSignUp }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        profile_pic: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isSignUp ? '/api/signup' : '/api/signin';
            const response = await axios.post(url, formData);
            if (isSignUp) {
                // Redirect to login after successful signup
                alert(response.data.message);
                navigate('/Login');
                console.log("testing masuk gak ke signup")
            } else {
                // Handle successful login, e.g., save token and user data
                alert(response.data.message);
                localStorage.setItem('token', response.data.token); // Save token to local storage
                // You can also save user info to local storage if needed
                navigate('/'); // Redirect to home after successful login
                console.log("testing masuk gak")
            }
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Something went wrong');
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isSignUp && (
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
            )}
            <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            {isSignUp && (
                <Form.Group controlId="formProfilePic">
                    <Form.Label>Profile Picture URL</Form.Label>
                    <Form.Control
                        type="text"
                        name="profile_pic"
                        placeholder="Enter your profile picture URL"
                        value={formData.profile_pic}
                        onChange={handleChange}
                    />
                </Form.Group>
            )}
            <Button variant="primary" type="submit">
                {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
        </Form>
    );
};

export default AuthForm;
