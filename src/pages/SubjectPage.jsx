import React, { useState, useEffect, useCallback, useMemo } from "react";

// ----------------------------------------------------
// --- GLOBAL UTILITIES (Hooks & Functions) ---
// ----------------------------------------------------

/**
 * @hook useLocalStorage
 * Custom Hook for state persistence using localStorage.
 * @param {string} key - The localStorage key.
 * @param {*} defaultValue - The default value if nothing is in storage.
 * @returns {[*, function]} A state value and a state setter function.
 */
const useLocalStorage = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      // Use stored value if it exists, otherwise use the default value
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Effect to sync state to localStorage whenever state changes
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
 * @returns {string} A unique identifier.
 */
const generateId = () => crypto.randomUUID();

/**
 * @function getLetterGrade
 * Utility function to convert numeric score to letter grade.
 * @param {number} score - The numeric score (0-100).
 * @returns {string} The corresponding letter grade.
 */
const getLetterGrade = (score) => {
  if (score === null || isNaN(score)) return 'N/A';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 63) return 'D';
  if (score >= 60) return 'D-';
  return 'F';
};

// ----------------------------------------------------
// --- MOCK DATA (Used for GradesPage dropdowns) ---
// ----------------------------------------------------
const MOCK_STUDENTS = [
  { id: 's1', name: 'Eves Mark Magbaril' },
  { id: 's2', name: 'Jane Smith' },
  { id: 's3', name: 'Carlos Alcaraz' },
];

const INITIAL_SUBJECTS = [
  { id: 'sub1', code: 'IT 101', name: 'Intro to Programming', credits: 3 },
  { id: 'sub2', code: 'MATH 203', name: 'Calculus I', credits: 4 },
  { id: 'sub3', code: 'ENG 101', name: 'Technical Writing', credits: 3 },
  { id: 'sub4', code: 'SCI 105', name: 'General Science', credits: 3 },
  { id: 'sub5', code: 'HIST 201', name: 'World History', credits: 3 },
];

// For Grades page compatibility
const MOCK_SUBJECTS = INITIAL_SUBJECTS;

// ----------------------------------------------------
// --- PAGE COMPONENTS ---
// ----------------------------------------------------

// 1. Landing Component (Home Page)
const LandingPage = ({ setPage }) => (
  <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl text-center max-w-lg border border-indigo-200">
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">
        Grading System Dashboard
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Manage students, subjects, and academic performance with ease.
      </p>
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => setPage('grades')}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg transform hover:scale-[1.02]"
        >
          Go to Grades Management
        </button>
        <button
          onClick={() => setPage('students')}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md"
        >
          View Students
        </button>
      </div>
    </div>
  </div>
);

// 2. Placeholder Student Component
const StudentsPage = () => (
  <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-8 bg-gradient-to-br from-green-50 to-teal-100">
    <div className="text-center bg-white p-10 rounded-2xl shadow-xl border border-green-200">
      <h2 className="text-3xl font-bold text-teal-700">Student Management</h2>
      <p className="text-gray-600 mt-2">
        This page is ready for future development (Add, Edit, Delete Students).
      </p>
    </div>
  </div>
);

// ----------------------------------------------------
// --- SUBJECT MODAL COMPONENT ---
// ----------------------------------------------------
const SubjectModal = ({ 
  subjectForm, 
  setSubjectForm, 
  editId, 
  handleAddOrEdit, 
  handleCloseModal 
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient bg-opacity-50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title" className="text-3xl font-bold mb-6 text-gray-800">
          {editId ? "✏️ Edit Subject" : "➕ Add New Subject"}
        </h2>

        <div className="space-y-4">
          {/* Subject Code Input */}
          <div>
            <label htmlFor="subject-code" className="block text-sm font-semibold text-gray-700 mb-2">
              Subject Code *
            </label>
            <input
              id="subject-code"
              type="text"
              value={subjectForm.code}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })
              }
              placeholder="e.g., IT 101"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Subject Name Input */}
          <div>
            <label htmlFor="subject-name" className="block text-sm font-semibold text-gray-700 mb-2">
              Subject Name *
            </label>
            <input
              id="subject-name"
              type="text"
              value={subjectForm.name}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, name: e.target.value })
              }
              placeholder="e.g., Introduction to Programming"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Credits Input */}
          <div>
            <label htmlFor="subject-credits" className="block text-sm font-semibold text-gray-700 mb-2">
              Credits *
            </label>
            <input
              id="subject-credits"
              type="number"
              value={subjectForm.credits}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, credits: parseInt(e.target.value) || 0 })
              }
              placeholder="e.g., 3"
              min="1"
              max="6"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              required
            />
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
            {editId ? "Save Changes" : "Add Subject"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// --- SUBJECTS PAGE COMPONENT ---
// ----------------------------------------------------
const SubjectsPage = () => {
  // State for all subjects data, persisted in localStorage
  const [subjects, setSubjects] = useLocalStorage("subjectRecords", INITIAL_SUBJECTS);

  // State for modal and form
  const [showModal, setShowModal] = useState(false);
  const [subjectForm, setSubjectForm] = useState({
    id: null,
    code: "",
    name: "",
    credits: 3,
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Reset and close modal
  const handleCloseModal = useCallback(() => {
    setSubjectForm({
      id: null,
      code: "",
      name: "",
      credits: 3,
    });
    setEditId(null);
    setShowModal(false);
  }, []);

  // ✅ Add or Edit Subject
  const handleAddOrEdit = useCallback(() => {
    // Input validation
    if (!subjectForm.code.trim() || !subjectForm.name.trim() || !subjectForm.credits) {
      alert("Validation failed: Please ensure Subject Code, Name, and Credits are entered.");
      return;
    }

    if (subjectForm.credits < 1 || subjectForm.credits > 6) {
      alert("Credits must be between 1 and 6.");
      return;
    }

    if (editId) {
      // Editing existing subject
      const updatedSubjects = subjects.map(s =>
        s.id === editId ? { ...subjectForm } : s
      );
      setSubjects(updatedSubjects);
    } else {
      // Adding new subject
      const subjectWithId = {
        ...subjectForm,
        id: generateId(),
      };
      setSubjects([...subjects, subjectWithId]);
    }

    handleCloseModal();
  }, [subjectForm, editId, subjects, setSubjects, handleCloseModal]);

  // ✅ Prepare to Edit Subject
  const handleEdit = useCallback((subjectId) => {
    const subjectToEdit = subjects.find(s => s.id === subjectId);
    if (subjectToEdit) {
      setSubjectForm({ ...subjectToEdit });
      setEditId(subjectId);
      setShowModal(true);
    }
  }, [subjects]);

  // ✅ Delete Subject
  const handleDelete = useCallback((subjectId) => {
    const subjectToDelete = subjects.find(s => s.id === subjectId);
    if (subjectToDelete && window.confirm(`Are you sure you want to delete "${subjectToDelete.code} - ${subjectToDelete.name}"? This action cannot be undone.`)) {
      setSubjects(subjects.filter((subject) => subject.id !== subjectId));
    }
  }, [subjects, setSubjects]);

  // --- Filtering & Stats Calculation ---
  const filteredSubjects = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return subjects.filter(
      (subject) =>
        subject.code.toLowerCase().includes(term) ||
        subject.name.toLowerCase().includes(term)
    ).sort((a, b) => a.code.localeCompare(b.code)); // Sort by subject code
  }, [subjects, searchTerm]);

  // Stats Calculation
  const totalSubjects = subjects.length;
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
  const averageCredits = totalSubjects > 0 ? (totalCredits / totalSubjects).toFixed(1) : 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 border border-white">
          {/* Header and Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Subject Management 📚
              </h1>
              <p className="text-gray-600">
                Manage all academic subjects, course codes, and credit information.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[200px]"
            >
              <span className="text-xl">➕</span>
              <span className="font-semibold">Add New Subject</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by subject code or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
              <span className="absolute left-4 top-3.5 text-gray-400 text-xl" aria-hidden="true">
                🔍
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
              <div className="text-3xl font-bold text-indigo-600">
                {totalSubjects}
              </div>
              <div className="text-sm text-gray-600">Total Subjects</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">
                {totalCredits}
              </div>
              <div className="text-sm text-gray-600">Total Credits</div>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200">
              <div className="text-3xl font-bold text-pink-600">
                {averageCredits}
              </div>
              <div className="text-sm text-gray-600">Average Credits/Subject</div>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <th className="py-4 px-6 text-left font-semibold">Subject Code</th>
                  <th className="py-4 px-6 text-left font-semibold">Subject Name</th>
                  <th className="py-4 px-6 text-center font-semibold">Credits</th>
                  <th className="py-4 px-6 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map((subject) => (
                    <tr
                      key={subject.id}
                      className="border-b hover:bg-indigo-50 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-gray-800 whitespace-nowrap">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                          {subject.code}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {subject.name}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-extrabold text-lg text-green-600 bg-green-100 px-3 py-1 rounded-full">
                          {subject.credits} {subject.credits === 1 ? 'credit' : 'credits'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(subject.id)}
                            className="text-indigo-600 hover:text-indigo-700 transition font-semibold px-3 py-1 rounded hover:bg-indigo-50"
                            aria-label={`Edit ${subject.code}`}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(subject.id)}
                            className="text-red-600 hover:text-red-700 transition font-semibold px-3 py-1 rounded hover:bg-red-50"
                            aria-label={`Delete ${subject.code}`}
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
                      colSpan="4"
                      className="text-center py-12 text-gray-500"
                    >
                      <div className="text-6xl mb-4">📚</div>
                      <div className="text-lg font-medium">
                        No subjects found
                      </div>
                      <div className="text-sm">
                        {searchTerm ? `No subjects match "${searchTerm}"` : 'Click "Add New Subject" to start managing subjects'}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Subject */}
      {showModal && (
        <SubjectModal
          subjectForm={subjectForm}
          setSubjectForm={setSubjectForm}
          editId={editId}
          handleAddOrEdit={handleAddOrEdit}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

// ----------------------------------------------------
// --- GRADE MODAL COMPONENT ---
// ----------------------------------------------------
const GradeModal = ({ newGrade, setNewGrade, editId, handleAddOrEdit, handleCloseModal }) => {
  const numericScore = parseFloat(newGrade.score);
  const letterGradePreview = getLetterGrade(numericScore);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title" className="text-3xl font-bold mb-6 text-gray-800">
          {editId ? "✏️ Edit Grade Record" : "➕ Record New Grade"}
        </h2>

        <div className="space-y-4">
          {/* Student Dropdown */}
          <div>
            <label htmlFor="student-select" className="block text-sm font-semibold text-gray-700 mb-2">
              Student Name *
            </label>
            <select
              id="student-select"
              value={newGrade.studentName}
              onChange={(e) =>
                setNewGrade({ ...newGrade, studentName: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition bg-white"
              required
            >
              <option value="" disabled>Select a student</option>
              {MOCK_STUDENTS.map(student => (
                <option key={student.id} value={student.name}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Dropdown */}
          <div>
            <label htmlFor="subject-select" className="block text-sm font-semibold text-gray-700 mb-2">
              Subject *
            </label>
            <select
              id="subject-select"
              value={newGrade.subjectCode}
              onChange={(e) =>
                setNewGrade({ ...newGrade, subjectCode: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition bg-white"
              required
            >
              <option value="" disabled>Select a subject</option>
              {MOCK_SUBJECTS.map(subject => (
                <option key={subject.id} value={subject.code}>
                  {subject.code} - {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Score Input */}
          <div>
            <label htmlFor="score-input" className="block text-sm font-semibold text-gray-700 mb-2">
              Score (%) *
            </label>
            <input
              id="score-input"
              type="number"
              value={newGrade.score}
              onChange={(e) =>
                setNewGrade({ ...newGrade, score: e.target.value })
              }
              placeholder="e.g. 92.5"
              min="0"
              max="100"
              step="0.1"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
              required
            />
            {/* UX Enhancement: Live Grade Preview */}
            <p className="mt-1 text-right text-sm text-indigo-600 font-medium">
                Current Grade: <span className="font-extrabold">{letterGradePreview}</span>
            </p>
          </div>

          {/* Date Input */}
          <div>
            <label htmlFor="date-input" className="block text-sm font-semibold text-gray-700 mb-2">
              Date Recorded
            </label>
            <input
              id="date-input"
              type="date"
              value={newGrade.date}
              onChange={(e) =>
                setNewGrade({ ...newGrade, date: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
            />
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
            className="px-6 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold transition shadow-lg hover:shadow-xl"
          >
            {editId ? "Save Changes" : "Record Grade"}
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Grades Page Component
const GradesPage = () => {
  // State for all grades data, persisted in localStorage
  const [grades, setGrades] = useLocalStorage("gradeRecords", []);

  // State for modal and form
  const [showModal, setShowModal] = useState(false);
  const [newGrade, setNewGrade] = useState({
    id: null,
    studentName: "", // Will store the full name (e.g., 'Eves Mark Magbaril')
    subjectCode: "", // Will store the code (e.g., 'IT 101')
    score: "",
    date: new Date().toISOString().substring(0, 10), // Default to today
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Reset and close modal
  const handleCloseModal = useCallback(() => {
    setNewGrade({
      id: null,
      studentName: "",
      subjectCode: "",
      score: "",
      date: new Date().toISOString().substring(0, 10),
    });
    setEditId(null);
    setShowModal(false);
  }, []);

  // ✅ Add or Edit Grade
  const handleAddOrEdit = useCallback(() => {
    // Basic Input validation
    const numericScore = parseFloat(newGrade.score);
    if (!newGrade.studentName || !newGrade.subjectCode || isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      alert("Validation failed: Please ensure Student, Subject, and a valid Score (0-100) are entered.");
      return;
    }

    if (editId) {
      // Editing existing grade
      const updatedGrades = grades.map(g =>
        g.id === editId ? { ...newGrade, score: numericScore } : g
      );
      setGrades(updatedGrades);
    } else {
      // Adding new grade
      const gradeWithId = {
        ...newGrade,
        id: generateId(),
        score: numericScore
      };
      setGrades([...grades, gradeWithId]);
    }

    // Close modal and reset form
    handleCloseModal();
  }, [newGrade, editId, grades, setGrades, handleCloseModal]);

  // ✅ Prepare to Edit Grade
  const handleEdit = useCallback((gradeId) => {
    const gradeToEdit = grades.find(g => g.id === gradeId);
    if (gradeToEdit) {
      // Set the form state with a copy of the grade data
      setNewGrade({
        ...gradeToEdit,
        score: gradeToEdit.score.toString() // Convert score back to string for input field
      });
      setEditId(gradeId);
      setShowModal(true);
    }
  }, [grades]);

  // ✅ Delete Grade
  const handleDelete = useCallback((gradeId) => {
    if (window.confirm("Are you sure you want to delete this grade record?")) {
      setGrades(grades.filter((grade) => grade.id !== gradeId));
    }
  }, [grades, setGrades]);

  // --- Filtering & Stats Calculation ---
  const filteredGrades = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return grades.filter(
      (grade) =>
        grade.studentName.toLowerCase().includes(term) ||
        grade.subjectCode.toLowerCase().includes(term)
    ).sort((a, b) => b.score - a.score); // Sort by score (descending)
  }, [grades, searchTerm]);

  // Stats Calculation
  const averageScore = filteredGrades.length > 0
    ? (filteredGrades.reduce((sum, g) => sum + g.score, 0) / filteredGrades.length).toFixed(1)
    : 0;

  const highestScore = filteredGrades.length > 0
    ? Math.max(...filteredGrades.map(g => g.score))
    : 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      {/* Header and Controls */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 border border-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Grades & Scores 📊
              </h1>
              <p className="text-gray-600">
                Record and analyze student performance across subjects.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[200px]"
            >
              <span className="text-xl">➕</span>
              <span className="font-semibold">Record New Grade</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by student name or subject code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
              />
              <span className="absolute left-4 top-3.5 text-gray-400 text-xl" aria-hidden="true">
                🔍
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200">
              <div className="text-3xl font-bold text-pink-600">
                {grades.length}
              </div>
              <div className="text-sm text-gray-600">Total Records</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
              <div className="text-3xl font-bold text-indigo-600">
                {averageScore}
              </div>
              <div className="text-sm text-gray-600">Average Score ({filteredGrades.length} shown)</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600">
                {highestScore}%
              </div>
              <div className="text-sm text-gray-600">Highest Score</div>
            </div>
          </div>

          {/* Grades Table */}
          <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                  <th className="py-4 px-6 text-left font-semibold sticky left-0 bg-gradient-to-r from-pink-500 to-purple-500">Student</th>
                  <th className="py-4 px-6 text-left font-semibold">Subject</th>
                  <th className="py-4 px-6 text-center font-semibold">Score (%)</th>
                  <th className="py-4 px-6 text-center font-semibold">Letter Grade</th>
                  <th className="py-4 px-6 text-left font-semibold">Date</th>
                  <th className="py-4 px-6 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.length > 0 ? (
                  filteredGrades.map((grade) => (
                    <tr
                      key={grade.id}
                      className="border-b hover:bg-pink-50 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-gray-800 sticky left-0 bg-white hover:bg-pink-50 transition-colors z-10 whitespace-nowrap">
                        {grade.studentName}
                      </td>
                      <td className="py-4 px-6 text-gray-700 whitespace-nowrap">
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                          {grade.subjectCode}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <span className={`font-extrabold text-lg ${grade.score >= 90 ? 'text-green-600' : grade.score >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {grade.score}%
                        </span>
                      </td>
                      {/* Letter Grade Column */}
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <span className="font-extrabold text-xl text-purple-600 bg-purple-100 px-3 py-1 rounded-md">
                          {getLetterGrade(grade.score)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm whitespace-nowrap">
                        {grade.date}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(grade.id)}
                            className="text-indigo-600 hover:text-indigo-700 transition font-semibold px-3 py-1 rounded hover:bg-indigo-50"
                            aria-label={`Edit grade for ${grade.studentName} in ${grade.subjectCode}`}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(grade.id)}
                            className="text-red-600 hover:text-red-700 transition font-semibold px-3 py-1 rounded hover:bg-red-50"
                            aria-label={`Delete grade for ${grade.studentName} in ${grade.subjectCode}`}
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
                      colSpan="6"
                      className="text-center py-12 text-gray-500"
                    >
                      <div className="text-6xl mb-4">💯</div>
                      <div className="text-lg font-medium">
                        No grades found
                      </div>
                      <div className="text-sm">
                        {searchTerm ? `No records match "${searchTerm}"` : 'Click "Record New Grade" to start tracking scores'}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Grade */}
      {showModal && (
        <GradeModal
          newGrade={newGrade}
          setNewGrade={setNewGrade}
          editId={editId}
          handleAddOrEdit={handleAddOrEdit}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

// ----------------------------------------------------
// --- MAIN APPLICATION COMPONENTS ---
// ----------------------------------------------------

const Navbar = ({ currentPage, setPage }) => {
  const navItems = [
    { name: 'Home', page: 'landing' },
    { name: 'Students', page: 'students' },
    { name: 'Subjects', page: 'subjects' },
    { name: 'Grades', page: 'grades' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 shadow-md" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={() => setPage('landing')} className="font-bold text-2xl text-indigo-600 hover:text-pink-600 transition-colors">
            Grading System
          </button>
          <div className="flex space-x-4 sm:space-x-8">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => setPage(item.page)}
                className={`
                  transition-colors duration-200 font-medium pb-1 border-b-2
                  ${currentPage === item.page
                    ? 'text-pink-600 border-pink-600 font-bold'
                    : 'text-gray-700 border-transparent hover:text-indigo-600 hover:border-indigo-600'
                  }
                `}
                aria-current={currentPage === item.page ? 'page' : undefined}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  // Simple state-based routing
  const [page, setPage] = useState('landing');

  const renderPage = useCallback(() => {
    switch (page) {
      case 'students':
        return <StudentsPage />;
      case 'subjects':
        return <SubjectsPage />;
      case 'grades':
        return <GradesPage />;
      case 'landing':
      default:
        return <LandingPage setPage={setPage} />;
    }
  }, [page]);

  return (
    <div className="font-sans antialiased min-h-screen">
      <Navbar currentPage={page} setPage={setPage} />
      <main className="min-h-[calc(100vh-64px)]">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;