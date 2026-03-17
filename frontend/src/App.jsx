import { BrowserRouter as Router, Routes, Route, Link, } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API = "http://localhost:5000/api";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  return (
    <Router>
      <nav style={{ padding: '10px', background: '#FF6B00', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/" style={{ color: '#fff', fontWeight: 'bold' }}>SkillNest Portal</Link>
        <div>
          {user ? (
            <>
              <span>Hi, {user.name} </span>
              <Link to="/dashboard" style={{ color: '#fff', margin: '0 10px' }}>Dashboard</Link>
              {user.role === 'admin' && <Link to="/admin" style={{ color: '#fff', margin: '0 10px' }}>Admin</Link>}
              <button onClick={() => { localStorage.clear(); window.location.reload(); }}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={{ color: '#fff' }}>Login</Link>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Courses user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}


const Courses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  useEffect(() => { axios.get(`${API}/courses`).then(res => setCourses(res.data)); }, []);
  const enroll = (c) => {
    if (!user) return alert("Login First");
    axios.post(`${API}/enroll`, { userId: user.userId, courseId: c._id, courseTitle: c.title }).then(() => alert("Enrolled!"));
  };
  return (
    <div style={{ padding: '20px' }}>
      <h2>Available Courses</h2>
      {courses.map(c => <div key={c._id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px' }}>
        <h3>{c.title} - {c.price}</h3>
        <button onClick={() => enroll(c)}>Enroll</button>
      </div>)}
    </div>
  );
};

// Updated Login Component
const Login = () => {
  const [form, setForm] = useState({});
  const submit = async (e) => {
    e.preventDefault();
    // Demo login for your video
    if(form.email === "admin@skillnest.com" || form.email === "test@gmail.com") {
        const dummyData = { token: "123", userId: "u1", role: form.email.includes("admin") ? "admin" : "user", name: "Pihu Singh" };
        localStorage.setItem('user', JSON.stringify(dummyData));
        window.location.href = "/";
    } else {
        alert("Use admin@skillnest.com or test@gmail.com for demo");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Login to access your courses</p>
        <form onSubmit={submit}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="email@example.com" required onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="auth-btn">Login</button>
        </form>
        <p className="auth-footer">Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

// Updated Register Component
const Register = () => {
  const [form, setForm] = useState({});
  const submit = (e) => { e.preventDefault(); alert("Registration successful! Now Login."); window.location.href="/login"; };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Join SkillNest and start learning</p>
        <form onSubmit={submit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" required onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="email@example.com" required onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="auth-btn">Register</button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
};

const Dashboard = ({ user }) => {
  // eslint-disable-next-line no-unused-vars
  const [list, setList] = useState([
    { _id: "e1", courseTitle: "Full Stack Web Development", price: "$99", status: "In Progress" },
    { _id: "e2", courseTitle: "UI/UX Masterclass", price: "$79", status: "Started" }
  ]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name || "SkillNest User"}! 👋</h1>
        <p>Your learning progress and enrolled courses are below.</p>
      </div>

      {/* Summary Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{list.length}</h3>
          <p>Enrolled Courses</p>
        </div>
        <div className="stat-card">
          <h3>2</h3>
          <p>Certificates Earned</p>
        </div>
        <div className="stat-card">
          <h3>85%</h3>
          <p>Avg. Progress</p>
        </div>
      </div>

      <h2 style={{marginTop: '40px', marginBottom: '20px'}}>My Learning Path</h2>
      
      
      <div className="enrolled-grid">
        {list.length > 0 ? list.map(l => (
          <div key={l._id} className="enrolled-card">
            <div className="card-tag">Online Course</div>
            <h3>{l.courseTitle}</h3>
            <div className="progress-bar">
               <div className="progress-fill" style={{width: '60%'}}></div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px'}}>
               <span style={{color: '#aaa'}}>{l.status}</span>
               <button className="continue-btn">Continue Learning</button>
            </div>
          </div>
        )) : (
          <p>No courses enrolled yet. <Link to="/" style={{color: '#FF6B00'}}>Browse Courses</Link></p>
        )}
      </div>
    </div>
  );
};

const Admin = () => {
  const [courses, setCourses] = useState([
    { _id: "1", title: "Full Stack Web Development", price: "$99" },
    { _id: "2", title: "UI/UX Masterclass", price: "$79" },
    { _id: "3", title: "Python for Data Science", price: "$89" },
    { _id: "4", title: "Digital Marketing", price: "$59" },
    { _id: "5", title: "Java Programming", price: "$69" },
    { _id: "6", title: "Graphic Design", price: "$49" }
  ]);
  const [form, setForm] = useState({ title: '', price: '' });

  // Add Function
  const addCourse = (e) => {
    e.preventDefault();
    if(!form.title || !form.price) return alert("Fill all fields");
    const newCourse = { _id: Date.now().toString(), ...form };
    setCourses([...courses, newCourse]);
    setForm({ title: '', price: '' });
    alert("Course Added Successfully!");
  };

  // Delete Function
  const deleteCourse = (id) => {
    setCourses(courses.filter(c => c._id !== id));
    alert("Course Deleted!");
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard - Course Management</h2>
      
      {/* Add Course Form */}
      <form className="admin-form" onSubmit={addCourse}>
        <input 
          placeholder="Course Title" 
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} 
        />
        <input 
          placeholder="Price (e.g. $99)" 
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })} 
        />
        <button type="submit" className="add-btn">Add New Course</button>
      </form>

      {/* Course Table */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(c => (
            <tr key={c._id}>
              <td>{c.title}</td>
              <td>{c.price}</td>
              <td>
                <button className="del-btn" onClick={() => deleteCourse(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;