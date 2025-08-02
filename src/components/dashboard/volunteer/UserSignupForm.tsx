// src/app/signup/page.tsx
"use client";

import { useState } from "react";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
        institution: "",
        educationLevel: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
        const res = await fetch("/api/users/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage("✅ User created successfully!");
            setFormData({
            firstName: "",
            middleName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            phoneNumber: "",
            dateOfBirth: "",
            gender: "",
            institution: "",
            educationLevel: "",
            address: "",
            });
        } else {
            setMessage(`❌ ${data.message}`);
        }
        } catch (error) {
        console.error("Signup error:", error);
        setMessage("❌ Something went wrong.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <main style={{ padding: "2rem" }}>
        <h1>Signup Form</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: "500px", gap: "0.5rem" }}>
            <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            <input name="middleName" placeholder="Middle Name (optional)" value={formData.middleName} onChange={handleChange} />
            <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
            <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
            
            <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>

            <input name="institution" placeholder="Institution" value={formData.institution} onChange={handleChange} required />
            
            <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} required>
                <option value="">Select Education Level</option>
                <option value="Undergrad">Undergrad</option>
                <option value="HSC/A-Level">HSC/A-Level</option>
                <option value="SSC/O-Level">SSC/O-Level</option>
            </select>

            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />

            <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
            </button>
        </form>

        {message && <p style={{ marginTop: "1rem", color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}
        </main>
    );
}
