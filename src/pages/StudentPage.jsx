import React, { useState, useCallback, useMemo, useEffect } from "react";

// ----------------------------------------------------
// --- GLOBAL UTILITIES ---
// ----------------------------------------------------

/**
 * @hook useLocalStorage
 * Custom Hook for state persistence using localStorage.
 */
const useLocalStorage = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};

/**
 * @function generateId
 * Utility function to generate a unique ID.
 */
const generateId = () => crypto.randomUUID();

// ----------------------------------------------------
// --- MOCK DATA (Initial students) ---
// ----------------------------------------------------
const INITIAL_STUDENTS = [
  { 
    id: 'stu1', 
    studentId: 'STU-2024-001', 
    firstName: 'John', 
    lastName: 'Doe', 
    email: 'john.doe@university.edu',
    phone: '+1 (555) 123-4567',
    enrollmentDate: '2024-09-01',
    major: 'Computer Science',
    status: 'active'
  },
  { 
    id: 'stu2', 
    studentId: 'STU-2024-002', 
    firstName: 'Jane', 
    lastName: 'Smith', 
    email: 'jane.smith@university.edu',
    phone: '+1 (555) 987-6543',
    enrollmentDate: '2024-08-15',
    major: 'Electrical Engineering',
    status: 'active'
  },
  { 
    id: 'stu3', 
    studentId: 'STU-2024-003', 
    firstName: 'Michael', 
    lastName: 'Johnson', 
    email: 'michael.j@university.edu',
    phone: '+1 (555) 456-7890',
    enrollmentDate: '2024-09-01',
    major: 'Business Administration',
    status: 'active'
  },
  { 
    id: 'stu4', 
    studentId: 'STU-2023-045', 
    firstName: 'Sarah', 
    lastName: 'Williams', 
    email: 'sarah.w@university.edu',
    phone: '+1 (555) 234-5678',
    enrollmentDate: '2023-08-20',
    major: 'Mechanical Engineering',
    status: 'graduated'
  },
  { 
    id: 'stu5', 
    studentId: 'STU-2024-078', 
    firstName: 'David', 
    lastName: 'Brown', 
    email: 'david.brown@university.edu',
    phone: '+1 (555) 345-6789',
    enrollmentDate: '2024-01-15',
    major: 'Computer Science',
    status: 'active'
  },
];

// ----------------------------------------------------
// --- MODAL COMPONENT ---
// ----------------------------------------------------
const StudentModal = ({ 
  studentForm, 
  setStudentForm, 
  editId, 
  handleAddOrEdit, 
  handleCloseModal 
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          {editId ? "✏️ Edit Student" : "➕ Add New Student"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={studentForm.firstName}
              onChange={(e) =>
                setStudentForm({ ...studentForm, firstName: e.target.value })
              }
              placeholder="e.g., John"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={studentForm.lastName}
              onChange={(e) =>
                setStudentForm({ ...studentForm, lastName: e.target.value })
              }
              placeholder="e.g., Doe"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={studentForm.email}
              onChange={(e) =>
                setStudentForm({ ...studentForm, email: e.target.value })
              }
              placeholder="e.g., john.doe@university.edu"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={studentForm.phone}
              onChange={(e) =>
                setStudentForm({ ...studentForm, phone: e.target.value })
              }
              placeholder="e.g., +1 (555) 123-4567"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Student ID *
            </label>
            <input
              type="text"
              value={studentForm.studentId}
              onChange={(e) =>
                setStudentForm({ ...studentForm, studentId: e.target.value.toUpperCase() })
              }
              placeholder="e.g., STU-2024-001"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Major *
            </label>
            <select
              value={studentForm.major}
              onChange={(e) =>
                setStudentForm({ ...studentForm, major: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              required
            >
              <option value="">Select a major</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Psychology">Psychology</option>
              <option value="Biology">Biology</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enrollment Date *
            </label>
            <input
              type="date"
              value={studentForm.enrollmentDate}
              onChange={(e) =>
                setStudentForm({ ...studentForm, enrollmentDate: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status *
            </label>
            <select
              value={studentForm.status}
              onChange={(e) =>
                setStudentForm({ ...studentForm, status: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={handleCloseModal}
            className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAddOrEdit}
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition shadow-lg hover:shadow-xl"
          >
            {editId ? "Save Changes" : "Add Student"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// --- STUDENTS PAGE COMPONENT ---
// ----------------------------------------------------
const StudentsPage = () => {
  const [students, setStudents] = useLocalStorage("studentRecords", INITIAL_STUDENTS);
  const [showModal, setShowModal] = useState(false);
  const [studentForm, setStudentForm] = useState({
    id: null,
    studentId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    enrollmentDate: new Date().toISOString().split('T')[0],
    major: "",
    status: "active"
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleCloseModal = useCallback(() => {
    setStudentForm({
      id: null,
      studentId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      enrollmentDate: new Date().toISOString().split('T')[0],
      major: "",
      status: "active"
    });
    setEditId(null);
    setShowModal(false);
  }, []);

  const handleAddOrEdit = useCallback(() => {
    if (!studentForm.studentId.trim() || !studentForm.firstName.trim() || 
        !studentForm.lastName.trim() || !studentForm.email.trim() || 
        !studentForm.major.trim() || !studentForm.enrollmentDate) {
      alert("Please fill all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentForm.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (editId) {
      const updatedStudents = students.map(s =>
        s.id === editId ? { ...studentForm } : s
      );
      setStudents(updatedStudents);
    } else {
      const studentWithId = {
        ...studentForm,
        id: generateId(),
      };
      setStudents([...students, studentWithId]);
    }

    handleCloseModal();
  }, [studentForm, editId, students, setStudents, handleCloseModal]);

  const handleEdit = useCallback((studentId) => {
    const studentToEdit = students.find(s => s.id === studentId);
    if (studentToEdit) {
      setStudentForm({ ...studentToEdit });
      setEditId(studentId);
      setShowModal(true);
    }
  }, [students]);

  const handleDelete = useCallback((studentId) => {
    const studentToDelete = students.find(s => s.id === studentId);
    if (studentToDelete && window.confirm(`Delete "${studentToDelete.firstName} ${studentToDelete.lastName}"?`)) {
      setStudents(students.filter((student) => student.id !== studentId));
    }
  }, [students, setStudents]);

  const filteredStudents = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return students
      .filter((student) => {
        const matchesSearch = 
          student.studentId.toLowerCase().includes(term) ||
          student.firstName.toLowerCase().includes(term) ||
          student.lastName.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term) ||
          student.major.toLowerCase().includes(term);
        
        const matchesStatus = statusFilter === "all" || student.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.studentId.localeCompare(b.studentId));
  }, [students, searchTerm, statusFilter]);

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const graduatedStudents = students.filter(s => s.status === 'graduated').length;
  
  const majorDistribution = useMemo(() => {
    const distribution = {};
    students.forEach(student => {
      distribution[student.major] = (distribution[student.major] || 0) + 1;
    });
    return distribution;
  }, [students]);

  const mostPopularMajor = useMemo(() => {
    if (Object.keys(majorDistribution).length === 0) return 'N/A';
    return Object.entries(majorDistribution).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }, [majorDistribution]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-700', emoji: '✅' },
      inactive: { color: 'bg-yellow-100 text-yellow-700', emoji: '⏸️' },
      graduated: { color: 'bg-blue-100 text-blue-700', emoji: '🎓' },
      suspended: { color: 'bg-red-100 text-red-700', emoji: '⛔' }
    };
    const config = statusConfig[status] || statusConfig.active;
    
    return (
      <span className={`${config.color} px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 w-fit`}>
        <span>{config.emoji}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 border border-white">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Student Management 👨‍🎓👩‍🎓
              </h1>
              <p className="text-gray-600">
                Manage student records, enrollment information, and academic details.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[200px]"
            >
              <span className="text-xl">➕</span>
              <span className="font-semibold">Add New Student</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, ID, email, or major..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
              <span className="absolute left-4 top-3.5 text-gray-400 text-xl">
                🔍
              </span>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
              <div className="text-3xl font-bold text-indigo-600">
                {totalStudents}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600">
                {activeStudents}
              </div>
              <div className="text-sm text-gray-600">Active Students</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">
                {graduatedStudents}
              </div>
              <div className="text-sm text-gray-600">Graduated</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">
                {mostPopularMajor}
              </div>
              <div className="text-sm text-gray-600">Most Popular Major</div>
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <th className="py-4 px-6 text-left font-semibold">Student ID</th>
                  <th className="py-4 px-6 text-left font-semibold">Name</th>
                  <th className="py-4 px-6 text-left font-semibold">Contact</th>
                  <th className="py-4 px-6 text-left font-semibold">Major</th>
                  <th className="py-4 px-6 text-center font-semibold">Enrollment Date</th>
                  <th className="py-4 px-6 text-center font-semibold">Status</th>
                  <th className="py-4 px-6 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b hover:bg-indigo-50 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-gray-800 whitespace-nowrap">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                          {student.studentId}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-700 font-semibold">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        <div className="space-y-1">
                          <div className="text-sm">{student.email}</div>
                          {student.phone && (
                            <div className="text-sm text-gray-500">{student.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {student.major}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center text-gray-700 whitespace-nowrap">
                        {new Date(student.enrollmentDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {getStatusBadge(student.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(student.id)}
                            className="text-indigo-600 hover:text-indigo-700 transition font-semibold px-3 py-1 rounded hover:bg-indigo-50"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="text-red-600 hover:text-red-700 transition font-semibold px-3 py-1 rounded hover:bg-red-50"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-12 text-gray-500"
                    >
                      <div className="text-6xl mb-4">👨‍🎓</div>
                      <div className="text-lg font-medium">
                        No students found
                      </div>
                      <div className="text-sm">
                        {searchTerm || statusFilter !== "all" 
                          ? `No students match your search criteria` 
                          : 'Click "Add New Student" to start managing student records'}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <StudentModal
          studentForm={studentForm}
          setStudentForm={setStudentForm}
          editId={editId}
          handleAddOrEdit={handleAddOrEdit}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default StudentsPage;