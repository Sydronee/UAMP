import { useState } from 'react';

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
    <div className="pt-4 flex justify-end">
      <button type="button" onClick={onNext} data-testid="next-btn-1" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Next</button>
    </div>
  </div>
);

const AcademicInfoStep = ({ data, onChange, onPrev, onNext }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Academic History & Course Selection</h3>
    <div>
      <label className="block text-sm font-medium text-gray-700">GPA (Out of 4.0)</label>
      <input type="number" step="0.01" max="4.0" name="gpa" value={data.gpa} onChange={onChange} data-testid="input-gpa" required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Program</label>
      <select name="program" value={data.program} onChange={onChange} data-testid="select-program" required
         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black">
        <option value="">Select a Program</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Business Administration">Business Administration</option>
        <option value="Engineering">Engineering</option>
      </select>
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
      <input type="file" name="transcript" onChange={onChange} accept=".pdf" data-testid="input-transcript"
        className="mt-1 block w-full sm:text-sm text-gray-700" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">ID / Passport (Image or PDF)</label>
      <input type="file" name="idDocument" onChange={onChange} accept=".pdf,image/*" data-testid="input-id"
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
    program: '',
    gpa: '',
    transcript: null,
    idDocument: null
  });

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('firstName', formData.firstName);
      payload.append('lastName', formData.lastName);
      payload.append('email', formData.email);
      payload.append('program', formData.program);
      payload.append('gpa', formData.gpa);
      
      if (formData.transcript) payload.append('transcript', formData.transcript);
      if (formData.idDocument) payload.append('idDocument', formData.idDocument);

      const response = await fetch('http://localhost:3000/api/applications', {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setSuccessMsg('Application submitted successfully!');
      setStep(4);
    } catch (err) {
      setErrorMsg('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        {step === 1 && <PersonalInfoStep data={formData} onChange={handleTextChange} onNext={() => setStep(2)} />}
        {step === 2 && <AcademicInfoStep data={formData} onChange={handleTextChange} onPrev={() => setStep(1)} onNext={() => setStep(3)} />}
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
