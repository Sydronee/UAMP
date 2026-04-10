import { useState } from 'react';

const nameRegex = /^[A-Za-z][A-Za-z\s'-]{1,49}$/;
const phoneRegex = /^\d{10,15}$/;
const postalCodeRegex = /^[A-Za-z0-9\s-]{4,10}$/;

const programs = ['Computer Science', 'Business Administration', 'Engineering'];
const intakes = ['Spring', 'Summer', 'Fall', 'Winter'];

// Subcomponents for the Multi-Step Form
const PersonalInfoStep = ({ data, onChange, onNext }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h3>
    <div>
      <label className="block text-sm font-medium text-gray-700">First Name</label>
      <input type="text" name="firstName" value={data.firstName} onChange={onChange} data-testid="input-firstname" required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Last Name</label>
      <input type="text" name="lastName" value={data.lastName} onChange={onChange} data-testid="input-lastname" required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input type="email" name="email" value={data.email} onChange={onChange} data-testid="input-email" required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
      <input type="text" name="phone" value={data.phone} onChange={onChange} data-testid="input-phone" required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
      <input type="date" name="dateOfBirth" value={data.dateOfBirth} onChange={onChange} data-testid="input-dob" required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Gender</label>
      <select name="gender" value={data.gender} onChange={onChange} data-testid="select-gender" required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black">
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
        <option value="Prefer not to say">Prefer not to say</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Address</label>
      <input type="text" name="address" value={data.address} onChange={onChange} data-testid="input-address" required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">City</label>
        <input type="text" name="city" value={data.city} onChange={onChange} data-testid="input-city" required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">State</label>
        <input type="text" name="state" value={data.state} onChange={onChange} data-testid="input-state" required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Country</label>
        <input type="text" name="country" value={data.country} onChange={onChange} data-testid="input-country" required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Postal Code</label>
        <input type="text" name="postalCode" value={data.postalCode} onChange={onChange} data-testid="input-postalcode" required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black" />
      </div>
    </div>
    <div className="pt-4 flex justify-end">
      <button type="button" onClick={onNext} data-testid="next-btn-1" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Next</button>
    </div>
  </div>
);

const AcademicInfoStep = ({ data, onChange, onPrev, onNext }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Academic History & Course Selection</h3>
    <div>
      <label className="block text-sm font-medium text-gray-700">CGPA (Out of 10.0)</label>
      <input type="number" step="0.01" min="0" max="10" name="gpa" value={data.gpa} onChange={onChange} data-testid="input-gpa" required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Program</label>
      <select name="program" value={data.program} onChange={onChange} data-testid="select-program" required
         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black">
        <option value="">Select a Program</option>
        {programs.map((program) => (
          <option key={program} value={program}>{program}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">High School Name</label>
      <input type="text" name="highSchoolName" value={data.highSchoolName} onChange={onChange} data-testid="input-highschool" required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
        <input type="number" name="graduationYear" value={data.graduationYear} onChange={onChange} data-testid="input-graduation-year" required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Entrance Exam Score (0-100)</label>
        <input type="number" name="entranceExamScore" value={data.entranceExamScore} onChange={onChange} data-testid="input-entrance-score"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black" />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Preferred Intake</label>
      <select name="preferredIntake" value={data.preferredIntake} onChange={onChange} data-testid="select-intake" required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black">
        <option value="">Select Intake</option>
        {intakes.map((intake) => (
          <option key={intake} value={intake}>{intake}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Statement of Purpose</label>
      <textarea name="statementOfPurpose" value={data.statementOfPurpose} onChange={onChange} rows="4" data-testid="input-sop" required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black" />
      <p className="text-xs text-gray-500 mt-1">Minimum 50 characters.</p>
    </div>
    <div className="pt-4 flex justify-between">
      <button type="button" onClick={onPrev} data-testid="prev-btn-2" className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300">Back</button>
      <button type="button" onClick={onNext} data-testid="next-btn-2" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Next</button>
    </div>
  </div>
);

const DocumentUploadStep = ({ data, onChange, onPrev, onSubmit, isSubmitting }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Document Upload</h3>
    <div>
      <label className="block text-sm font-medium text-gray-700">High School Transcript (PDF)</label>
      <input type="file" name="transcript" onChange={onChange} accept=".pdf" data-testid="input-transcript" required
        className="mt-1 block w-full sm:text-sm text-gray-700" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">ID / Passport (Image or PDF)</label>
      <input type="file" name="idDocument" onChange={onChange} accept=".pdf,image/*" data-testid="input-id" required
        className="mt-1 block w-full sm:text-sm text-gray-700" />
    </div>
    <div className="pt-4 flex justify-between">
      <button type="button" onClick={onPrev} data-testid="prev-btn-3" className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300" disabled={isSubmitting}>Back</button>
      <button type="button" onClick={onSubmit} data-testid="submit-button" disabled={isSubmitting} className={`py-2 px-4 rounded-md text-white ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
        {isSubmitting ? <span data-testid="loading-spinner">Submitting...</span> : 'Submit Application'}
      </button>
    </div>
  </div>
);

export default function MultiStepApplicationForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    program: '',
    gpa: '',
    entranceExamScore: '',
    highSchoolName: '',
    graduationYear: '',
    preferredIntake: '',
    statementOfPurpose: '',
    transcript: null,
    idDocument: null
  });

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!nameRegex.test(formData.firstName.trim())) return 'First name must contain only letters.';
      if (!nameRegex.test(formData.lastName.trim())) return 'Last name must contain only letters.';
      if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) return 'Please enter a valid email.';
      if (!phoneRegex.test(formData.phone.trim())) return 'Phone number must contain 10 to 15 digits only.';
      if (!formData.dateOfBirth) return 'Date of birth is required.';
      if (!formData.gender) return 'Please select your gender.';
      if (formData.address.trim().length < 5) return 'Address must be at least 5 characters long.';
      if (formData.city.trim().length < 2 || formData.state.trim().length < 2 || formData.country.trim().length < 2) {
        return 'City, state, and country are required.';
      }
      if (!postalCodeRegex.test(formData.postalCode.trim())) return 'Postal code is invalid.';
      return '';
    }

    if (currentStep === 2) {
      const cgpa = Number(formData.gpa);
      if (Number.isNaN(cgpa) || cgpa < 0 || cgpa > 10) return 'CGPA must be between 0 and 10.';
      if (!programs.includes(formData.program)) return 'Please select a valid program.';
      if (formData.highSchoolName.trim().length < 2) return 'High school name is required.';

      const year = Number(formData.graduationYear);
      const maxYear = new Date().getFullYear() + 1;
      if (!Number.isInteger(year) || year < 1990 || year > maxYear) return 'Graduation year is invalid.';

      if (formData.entranceExamScore !== '') {
        const entrance = Number(formData.entranceExamScore);
        if (Number.isNaN(entrance) || entrance < 0 || entrance > 100) return 'Entrance exam score must be between 0 and 100.';
      }

      if (!intakes.includes(formData.preferredIntake)) return 'Please select a preferred intake.';
      if (formData.statementOfPurpose.trim().length < 50) return 'Statement of purpose must be at least 50 characters.';
      return '';
    }

    if (currentStep === 3) {
      if (!formData.transcript) return 'Transcript is required.';
      if (!formData.idDocument) return 'ID document is required.';
      return '';
    }

    return '';
  };

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async () => {
    const stepError = validateStep(3);
    setErrorMsg(stepError);
    setSuccessMsg('');
    if (stepError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('firstName', formData.firstName);
      payload.append('lastName', formData.lastName);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('dateOfBirth', formData.dateOfBirth);
      payload.append('gender', formData.gender);
      payload.append('address', formData.address);
      payload.append('city', formData.city);
      payload.append('state', formData.state);
      payload.append('country', formData.country);
      payload.append('postalCode', formData.postalCode);
      payload.append('program', formData.program);
      payload.append('gpa', formData.gpa);
      payload.append('entranceExamScore', formData.entranceExamScore || '0');
      payload.append('highSchoolName', formData.highSchoolName);
      payload.append('graduationYear', formData.graduationYear);
      payload.append('preferredIntake', formData.preferredIntake);
      payload.append('statementOfPurpose', formData.statementOfPurpose);
      
      if (formData.transcript) payload.append('transcript', formData.transcript);
      if (formData.idDocument) payload.append('idDocument', formData.idDocument);

      const response = await fetch('http://localhost:3000/api/applications', {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) {
        const errPayload = await response.json().catch(() => ({}));
        if (errPayload?.details) {
          const firstErrorField = Object.keys(errPayload.details).find((key) => Array.isArray(errPayload.details[key]) && errPayload.details[key][0]);
          if (firstErrorField) {
            throw new Error(errPayload.details[firstErrorField][0]);
          }
        }
        throw new Error(errPayload?.error || 'Failed to submit application');
      }

      setSuccessMsg('Application submitted successfully!');
      setStep(4);
    } catch (err) {
      setErrorMsg(err.message || 'Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goNextFromStep1 = () => {
    const stepError = validateStep(1);
    setErrorMsg(stepError);
    if (!stepError) setStep(2);
  };

  const goNextFromStep2 = () => {
    const stepError = validateStep(2);
    setErrorMsg(stepError);
    if (!stepError) setStep(3);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md border border-gray-100">
      
      {/* Stepper Logic UI */}
      {step < 4 && (
      <div className="flex items-center justify-between mb-8 relative">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center z-10 bg-white p-1">
            <div data-testid={`step-indicator-${s}`} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{s}</div>
          </div>
        ))}
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 h-0.5 bg-gray-200 w-full -z-10 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 transition-all duration-300 -z-10 -translate-y-1/2" style={{ width: `${(step - 1) * 50}%` }}></div>
      </div>
      )}

      {errorMsg && <div data-testid="error-message" className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMsg}</div>}
      {successMsg && <div data-testid="success-message" className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMsg}</div>}

      <form data-testid="application-form" onSubmit={(e) => e.preventDefault()}>
        {step === 1 && <PersonalInfoStep data={formData} onChange={handleTextChange} onNext={goNextFromStep1} />}
        {step === 2 && <AcademicInfoStep data={formData} onChange={handleTextChange} onPrev={() => setStep(1)} onNext={goNextFromStep2} />}
        {step === 3 && <DocumentUploadStep data={formData} onChange={handleFileChange} onPrev={() => setStep(2)} onSubmit={handleSubmit} isSubmitting={isSubmitting} />}
        {step === 4 && (
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
            <p className="text-gray-600">Your application is under review. You can track your status in your student portal.</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium">Submit Another</button>
          </div>
        )}
      </form>
    </div>
  );
}
