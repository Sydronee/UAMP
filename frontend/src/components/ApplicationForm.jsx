import { useState } from 'react';

function ApplicationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    program: '',
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('http://localhost:3000/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setSuccessMsg('Application submitted successfully!');
      setFormData({ firstName: '', lastName: '', email: '', program: '' });
    } catch (err) {
      setErrorMsg('Error submitting application. Please try again.');
    }
  };

  return (
    <div className="application-form-container">
      <h2>Student Admission Application</h2>
      {successMsg && <div data-testid="success-message" className="success">{successMsg}</div>}
      {errorMsg && <div data-testid="error-message" className="error">{errorMsg}</div>}

      <form onSubmit={handleSubmit} data-testid="application-form">
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            data-testid="input-firstname"
            required
          />
        </div>

        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            data-testid="input-lastname"
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            data-testid="input-email"
            required
          />
        </div>

        <div>
          <label>Program</label>
          <select
            name="program"
            value={formData.program}
            onChange={handleChange}
            data-testid="select-program"
            required
          >
            <option value="">Select a Program</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Business Administration">Business Administration</option>
            <option value="Engineering">Engineering</option>
          </select>
        </div>

        <button type="submit" data-testid="submit-button">Submit Application</button>
      </form>
    </div>
  );
}

export default ApplicationForm;
