
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Load courses from LocalStorage
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('edutrack_courses');

      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          title: 'React.js Development',
          instructor: 'John Smith',
          progress: 75,
          icon: '⚛️',
          color: 'purple',
          category: 'Programming',
        },
        {
          id: 2,
          title: 'Python Programming',
          instructor: 'Sarah Johnson',
          progress: 60,
          icon: '🐍',
          color: 'blue',
          category: 'Programming',
        },
        {
          id: 3,
          title: 'UI/UX Design',
          instructor: 'David Wilson',
          progress: 40,
          icon: '🎨',
          color: 'orange',
          category: 'Design',
        },
      ];
    } catch {
      return [];
    }
  });

  // Load assignments from LocalStorage
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem('edutrack_assignments');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    category: 'Programming',
  });

  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDate, setAssignmentDate] = useState('');

  // Save courses
  useEffect(() => {
    localStorage.setItem('edutrack_courses', JSON.stringify(courses));
  }, [courses]);

  // Save assignments
  useEffect(() => {
    localStorage.setItem(
      'edutrack_assignments',
      JSON.stringify(assignments)
    );
  }, [assignments]);

  // Search and filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === 'All' || course.category === category;

    return matchesSearch && matchesCategory;
  });

  // Add course form
  function openAddForm() {
    setEditingId(null);
    setFormData({
      title: '',
      instructor: '',
      category: 'Programming',
    });
    setShowForm(true);
  }

  // Save or update course
  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title.trim() || !formData.instructor.trim()) return;

    if (editingId !== null) {
      setCourses((previous) =>
        previous.map((course) =>
          course.id === editingId
            ? {
                ...course,
                ...formData,
                icon: formData.category === 'Design' ? '🎨' : '📘',
                color: formData.category === 'Design' ? 'orange' : 'purple',
              }
            : course
        )
      );
    } else {
      const newCourse = {
        id: Date.now(),
        ...formData,
        progress: 0,
        icon: formData.category === 'Design' ? '🎨' : '📘',
        color: formData.category === 'Design' ? 'orange' : 'purple',
      };

      setCourses((previous) => [...previous, newCourse]);
    }

    setShowForm(false);
    setEditingId(null);
  }

  // Edit course
  function handleEdit(course) {
    setEditingId(course.id);
    setFormData({
      title: course.title,
      instructor: course.instructor,
      category: course.category,
    });
    setShowForm(true);
  }

  // Delete course
  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses((previous) =>
        previous.filter((course) => course.id !== id)
      );
    }
  }

  // Update course progress
  function updateCourseProgress(id, newProgress) {
    setCourses((previous) =>
      previous.map((course) =>
        course.id === id
          ? { ...course, progress: Number(newProgress) }
          : course
      )
    );
  }

  // Add assignment
  function handleAddAssignment(e) {
    e.preventDefault();

    if (!assignmentTitle.trim() || !assignmentDate) return;

    const newAssignment = {
      id: Date.now(),
      title: assignmentTitle.trim(),
      dueDate: assignmentDate,
      completed: false,
    };

    setAssignments((previous) => [...previous, newAssignment]);

    setAssignmentTitle('');
    setAssignmentDate('');
  }

  // Complete or uncomplete assignment
  function toggleAssignment(id) {
    setAssignments((previous) =>
      previous.map((assignment) =>
        assignment.id === id
          ? { ...assignment, completed: !assignment.completed }
          : assignment
      )
    );
  }

  // Delete assignment
  function deleteAssignment(id) {
    setAssignments((previous) =>
      previous.filter((assignment) => assignment.id !== id)
    );
  }

  const completedAssignments = assignments.filter(
    (assignment) => assignment.completed
  ).length;

  // Calculate average course progress
  const averageProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce((total, course) => total + course.progress, 0) /
          courses.length
        )
      : 0;

  return (
    <div className="app-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">EduTrack<span>.</span></h2>

        <p className="menu-heading">MENU</p>

        <nav>
          <a href="#dashboard" className="nav-link active">🏠 Dashboard</a>
          <a href="#courses" className="nav-link">📚 My Courses</a>
          <a href="#assignments" className="nav-link">📝 Assignments</a>
          <a href="#dashboard" className="nav-link">📅 Calendar</a>
          <a href="#progress" className="nav-link">📊 My Progress</a>
        </nav>

        <div className="sidebar-bottom">
          <a href="#dashboard" className="nav-link">⚙️ Settings</a>
          <a href="#dashboard" className="nav-link">🚪 Logout</a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" id="dashboard">

        {/* Header */}
        <header className="topbar">
          <div>
            <h3>Student Dashboard</h3>
            <p>Welcome back to your learning journey!</p>
          </div>

          <div className="profile">
            <span>🔔</span>
            <div className="avatar">S</div>
            <span>Sangeetha</span>
          </div>
        </header>

        {/* Welcome */}
        <section className="welcome-section">
          <div>
            <h1>Hello, Sangeetha! 👋</h1>
            <p>Keep learning, keep growing. You're doing great!</p>
          </div>
          <div className="welcome-icon">🎓</div>
        </section>

        {/* Statistics */}
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon purple-bg">📚</span>
            <div>
              <p>Enrolled Courses</p>
              <h2>{String(courses.length).padStart(2, '0')}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon blue-bg">✅</span>
            <div>
              <p>Completed Assignments</p>
              <h2>{String(completedAssignments).padStart(2, '0')}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon orange-bg">📝</span>
            <div>
              <p>Total Assignments</p>
              <h2>{String(assignments.length).padStart(2, '0')}</h2>
            </div>
          </div>
        </section>

        {/* Courses */}
        <section className="courses-section" id="courses">
          <div className="section-heading">
            <div>
              <h2>My Courses</h2>
              <p>Manage and explore your courses</p>
            </div>

            <button className="add-button" onClick={openAddForm}>
              + Add Course
            </button>
          </div>

          <div className="course-controls">
            <input
              type="search"
              placeholder="Search by course or instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
            </select>
          </div>

          {/* Add/Edit Course Form */}
          {showForm && (
            <form className="course-form" onSubmit={handleSubmit}>
              <h3>{editingId !== null ? 'Edit Course' : 'Add New Course'}</h3>

              <input
                type="text"
                placeholder="Enter course name"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Enter instructor name"
                value={formData.instructor}
                onChange={(e) =>
                  setFormData({ ...formData, instructor: e.target.value })
                }
                required
              />

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
              </select>

              <div className="form-actions">
                <button type="submit" className="add-button">
                  {editingId !== null ? 'Update Course' : 'Save Course'}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Course Cards */}
          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <div className="course-card" key={course.id}>
                <div className={`course-icon ${course.color}`}>
                  {course.icon}
                </div>

                <h3>{course.title}</h3>
                <p className="instructor">
                  Instructor: {course.instructor}
                </p>

                <span className="category-label">{course.category}</span>

                <div className="progress-info">
                  <span>Progress</span>
                  <strong>{course.progress}%</strong>
                </div>

                <div className="progress-bar">
                  <div
                    className={`progress-fill ${course.color}`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>

                {/* Course Progress Slider */}
                <div style={{ marginTop: '15px' }}>
                  <label
                    style={{
                      fontSize: '12px',
                      color: '#929bad',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    Adjust course progress: {course.progress}%
                  </label>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={course.progress}
                    onChange={(e) =>
                      updateCourseProgress(course.id, e.target.value)
                    }
                    style={{
                      width: '100%',
                      cursor: 'pointer',
                      accentColor: '#5b67ee',
                    }}
                  />
                </div>

                <button
                  className="continue-button"
                  onClick={() => setSelectedCourse(course)}
                >
                  View Course →
                </button>

                <div className="card-actions">
                  <button className="edit-button" onClick={() => handleEdit(course)}>
                    ✏️ Edit
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(course.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <p className="no-courses">No courses found!</p>
          )}
        </section>

        {/* Assignments Section */}
        <section id="assignments" style={{ marginTop: '45px' }}>
          <div className="section-heading">
            <div>
              <h2>My Assignments 📝</h2>
              <p>Keep track of your learning tasks</p>
            </div>
          </div>

          {/* Assignment Form */}
          <form
            onSubmit={handleAddAssignment}
            style={{
              background: 'white',
              padding: '22px',
              borderRadius: '13px',
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '22px',
            }}
          >
            <input
              type="text"
              placeholder="Enter assignment name"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              required
              style={{
                flex: '2',
                minWidth: '180px',
                padding: '12px',
                border: '1px solid #e1e5ef',
                borderRadius: '8px',
              }}
            />

            <input
              type="date"
              value={assignmentDate}
              onChange={(e) => setAssignmentDate(e.target.value)}
              required
              style={{
                flex: '1',
                minWidth: '150px',
                padding: '12px',
                border: '1px solid #e1e5ef',
                borderRadius: '8px',
              }}
            />

            <button type="submit" className="add-button">
              + Add Assignment
            </button>
          </form>

          {/* Assignment List */}
          <div style={{ display: 'grid', gap: '12px' }}>
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                style={{
                  background: 'white',
                  padding: '18px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={assignment.completed}
                    onChange={() => toggleAssignment(assignment.id)}
                  />

                  <div>
                    <h4
                      style={{
                        textDecoration: assignment.completed ? 'line-through' : 'none',
                        color: assignment.completed ? '#929bad' : '#29344c',
                      }}
                    >
                      {assignment.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#929bad', marginTop: '5px' }}>
                      Due date: {assignment.dueDate}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      color: assignment.completed ? '#16a34a' : '#d97706',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    {assignment.completed ? 'Completed' : 'Pending'}
                  </span>

                  <button
                    onClick={() => deleteAssignment(assignment.id)}
                    style={{
                      border: 'none',
                      background: '#fff0f0',
                      color: '#df5555',
                      padding: '9px 12px',
                      borderRadius: '7px',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {assignments.length === 0 && (
              <p className="no-courses">
                No assignments yet. Add your first assignment above!
              </p>
            )}
          </div>
        </section>

        {/* Progress Section */}
        <section id="progress" style={{ marginTop: '35px', marginBottom: '30px' }}>
          <h2 style={{ marginBottom: '12px' }}>My Progress</h2>

          <p style={{ color: '#929bad', fontSize: '14px' }}>
            You have completed {completedAssignments} out of {assignments.length} assignments.
          </p>

          <div style={{ marginTop: '18px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              Overall Course Progress: {averageProgress}%
            </p>

            <div className="progress-bar">
              <div
                className="progress-fill purple"
                style={{ width: `${averageProgress}%` }}
              ></div>
            </div>
          </div>
        </section>

        {/* Course Details */}
        {selectedCourse && (
          <div className="modal-overlay">
            <div className="details-modal">
              <button
                className="close-button"
                onClick={() => setSelectedCourse(null)}
              >
                ✕
              </button>

              <h2>{selectedCourse.icon} {selectedCourse.title}</h2>
              <p>Instructor: {selectedCourse.instructor}</p>
              <p>Category: {selectedCourse.category}</p>
              <p>Learning progress: {selectedCourse.progress}%</p>

              <button
                className="add-button"
                onClick={() => setSelectedCourse(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
