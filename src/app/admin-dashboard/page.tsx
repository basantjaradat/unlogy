'use client';
import React, { useState,useRef, useEffect } from 'react';
import { MdDashboard } from 'react-icons/md';
import axios from 'axios';
import { FaBars, FaUserCircle, FaDownload, FaCrown, FaTags, FaBookmark, FaLifeRing, FaSignOutAlt ,FaFolderOpen, FaUserTie, FaUserGraduate  } from 'react-icons/fa';
import './admin-dashboard.css';

interface project {
  id: number;
  name: string;
  icon: string;
  courseCount: number;
} 


const Admindashboard: React.FC = () => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [instructors, setInstructors] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [projects, setProjects] = useState<project[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [instructorPage, setInstructorPage] = useState(1);
  const [freelancerPage, setFreelancerPage] = useState(1);
  const [openInstructorDropdown, setOpenInstructorDropdown] = useState<number | null>(null);
  const [openFreelancerDropdown, setOpenFreelancerDropdown] = useState<number | null>(null);


const rowsPerPage = 5;

const paginatedInstructors = Array.isArray(instructors) ? instructors.slice(
  (instructorPage - 1) * rowsPerPage,
  instructorPage * rowsPerPage
) : [];

const paginatedFreelancers = Array.isArray(freelancers) ? freelancers.slice(
  (freelancerPage - 1) * rowsPerPage,
  freelancerPage * rowsPerPage
) : [];

const totalInstructorPages = Math.ceil(instructors.length / rowsPerPage);
const totalFreelancerPages = Math.ceil(freelancers.length / rowsPerPage);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleDeleteInstructor = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5151/api/Instructors/${id}`); //endpoint for delete instructor
      setInstructors(instructors.filter((inst: any) => inst.id !== id)); 
    } catch (err) {
      console.error('Failed to delete instructor:', err);
    }
  };
  
  const handleDeleteFreelancer = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5151/api/Freelancers/${id}`); //endpoint for delete freelancer
      setFreelancers(freelancers.filter((free: any) => free.id !== id));
    } catch (err) {
      console.error('Failed to delete freelancer:', err);
    }
  };
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(''); //endpoint for the admin name
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    };
    fetchUser();

    const fetchData = async () => {
      try {
        const [instructorRes, freelancerRes] = await Promise.all([
          axios.get(''),//endpoint for the instructor data
          axios.get(''),//endpoint for the freelancer data
        ]);
        
        // Defensive check:
        setInstructors(Array.isArray(instructorRes.data) ? instructorRes.data : []);
        setFreelancers(Array.isArray(freelancerRes.data) ? freelancerRes.data : []);
      } catch (error) {
        console.error('Error fetching instructor/freelancer data:', error);
        setInstructors([]);
        setFreelancers([]);
      }
    };
  
    fetchData();
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5151/api/Categories/TopCategories');
        setProjects(res.data);
      } catch (err) {
        
      } finally {
        
      }
    };
    fetchProjects();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

return (
  <div className="layout">
    <nav className="navbar">
      <div className="navbar-left">
        <FaBars className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)} />
        <span className="page-name">Dashboard</span>
      </div>
      <div className="navbar-right">
        <div className="profile-wrapper" ref={dropdownRef}>
          <div className="profile-icon" onClick={toggleDropdown}>
            <FaUserCircle size={32} />
          </div>
          {isOpen && (
            <div className="profile-dropdown">
              <div className="profile-header">
              <div className="avatar">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                <p className="username">{user?.username || 'Loading...'}</p>
                  <button className="edit-profile">Edit profile</button>
                </div>
              </div>
              <ul className="dropdown-list">
                <li><FaTags /> My Merchandising Licenses</li>
                <li><FaBookmark /> Bookmarks</li>
                <li><FaLifeRing /> Support</li>
                <li className="logout"><FaSignOutAlt /> Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>

    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <p className='app-name'>Aqlama</p>
      <img src="/images/logo.png" alt="Logo" className="logo" />
      <ul>
        <li><MdDashboard className='sidebar-icon' />Dashboard</li>
        <li><FaFolderOpen className='sidebar-icon' />Projects</li>
        <li><FaUserTie className='sidebar-icon' />Project Managers</li>
        <li><FaUserGraduate className='sidebar-icon' />Freelancers</li>
      </ul>
    </aside>

    <main className={`main-content ${sidebarOpen ? 'expanded' : 'collapsed'}`}>
      {/* Instructors */}
      <div className="instructor-container">
        <div className="instructor-header">
          <h2>Instructors</h2>
          <button className="add-button">+ Add new Instructor</button>
        </div>
        <table className="instructor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Projects</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {paginatedInstructors.map((inst, index) => (
              <tr key={index}>
                <td>{inst.name}</td>
                <td>{inst.email}</td>
                <td>{inst.projects}</td>
                <td className="dropdown-cell">
                <div className="dots" onClick={() => setOpenInstructorDropdown(openInstructorDropdown === index ? null : index)}>...</div>
                   {openInstructorDropdown === index && (
                    <div className="dropdown-menu">
                    <button onClick={() => handleDeleteInstructor(inst.id)}>Delete</button>
                    </div>
                     )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
  <button disabled={instructorPage === 1} onClick={() => setInstructorPage(instructorPage - 1)}>{'<'}</button>
  {[...Array(totalInstructorPages)].map((_, i) => (
    <button
      key={i}
      className={instructorPage === i + 1 ? 'active' : ''}
      onClick={() => setInstructorPage(i + 1)}
    >
      {i + 1}
    </button>
  ))}
  <button disabled={instructorPage === totalInstructorPages} onClick={() => setInstructorPage(instructorPage + 1)}>{'>'}</button>
</div>
      </div>

      {/* Freelancers */}
      <div className="instructor-container">
        <div className="instructor-header">
          <h2>Freelancers</h2>
          <button className="add-button">+ Add new freelancer</button>
        </div>
        <table className="instructor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {paginatedFreelancers.map((inst, index) => (
              <tr key={index}>
                <td>{inst.name}</td>
                <td>{inst.email}</td>
                <td className="dropdown-cell">
                <div className="dots" onClick={() => setOpenFreelancerDropdown(openFreelancerDropdown === index ? null : index)}>...</div>
                  {openFreelancerDropdown === index && (
                  <div className="dropdown-menu">
                   <button onClick={() => handleDeleteFreelancer(inst.id)}>Delete</button>
                  </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
  <button disabled={freelancerPage === 1} onClick={() => setFreelancerPage(freelancerPage - 1)}>{'<'}</button>
  {[...Array(totalFreelancerPages)].map((_, i) => (
    <button
      key={i}
      className={freelancerPage === i + 1 ? 'active' : ''}
      onClick={() => setFreelancerPage(i + 1)}
    >
      {i + 1}
    </button>
  ))}
  <button disabled={freelancerPage === totalFreelancerPages} onClick={() => setFreelancerPage(freelancerPage + 1)}>{'>'}</button>
</div>
      </div>

      {/* Top Projects */}
      <div className="projects-container">
  <div className="projects-header">
    <h2 >Top Projects</h2>
    <button className="show-all-btn">+ Add new Project</button>
  </div>

  <section className="projects-grid">
    {projects.map((cat) => (
      <div className="projects-card" key={cat.id}>
        <img src={`http://localhost:5151/CategoriesIcons/${cat.icon}`} alt={cat.name} className="category-icon" />
        <h3>{cat.name}</h3>
        <p>{cat.courseCount} Courses</p>
      </div>
    ))}
  </section>
</div>

    </main>
  </div>
);

};

export default Admindashboard;
