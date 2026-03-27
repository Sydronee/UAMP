import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ApplicationForm from './components/ApplicationForm';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <nav className="bg-indigo-600 text-white p-4 shadow-md flex justify-between items-center">
          <div className="text-xl font-bold">University Portal</div>
          <div className="space-x-4">
            <Link to="/" className="hover:text-indigo-200">Student Apply</Link>
            <Link to="/admin-login" className="hover:text-indigo-200">Admin</Link>
          </div>
        </nav>

        <main className="flex-1 bg-gray-50 flex flex-col">
          <Routes>
            <Route path="/" element={
              <div className="py-8">
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-extrabold text-gray-900">Start Your Journey</h1>
                  <p className="text-gray-600 mt-2">Complete your admission form below.</p>
                </div>
                <ApplicationForm />
              </div>
            } />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
