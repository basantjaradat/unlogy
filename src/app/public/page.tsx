'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import './public.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';
import { FaClock, FaStar, FaStarHalfAlt, FaRegStar, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface project {
  id: number;
  name: string;
  icon: string;
  courseCount: number;
}

interface recentproject {
  id: number;
  title: string;
  rating: number;
  durationInHours: number;
  imageUrl: string;
}

const Public: React.FC = () => {
  const [projects, setProjects] = useState<project[]>([]);
  const [RecentProjects, setRecentProjects] = useState<recentproject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingRecentProjects, setLoadingRecentProjects] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);
  const [RecentProjectsError, setRecentProjectsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5151/api/Categories/TopCategories');
        setProjects(res.data);
      } catch (err) {
        setCatError('Failed to load projects');
      } finally {
        setLoadingProjects(false);
      }
    };

    const fetchRecentProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5151/api/Courses/popular');
        setRecentProjects(res.data);
      } catch (err) {
        setRecentProjectsError('Failed to load recent projects');
      } finally {
        setLoadingRecentProjects(false);
      }
    };

    fetchProjects();
    fetchRecentProjects();
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} color="gold" />);
      } else if (i === fullStars && hasHalf) {
        stars.push(<FaStarHalfAlt key={i} color="gold" />);
      } else {
        stars.push(<FaRegStar key={i} color="#ccc" />);
      }
    }
    return stars;
  };

  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <img src="/images/logo.png" alt="Logo" className="logo" />
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="/admin-dashboard">Projects</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} />
          <input type="text" placeholder="What do you want to learn?" />
        </div>
      </header>

      {/* Hero */}
      <div className="upper-public">
        <p className="p1">Start learning today</p>
        <p className="p2">The Best<br /> Platform Enroll in<br /> Your Special <br />Course</p>
        <p className="p3">Your Coding Journey Starts Here.<br />Interactive, flexible, and fun programming courses<br /> for future developers.</p>
        <div className="button-group">
          <Link href="/login"><button className="login-button">Login</button></Link>
          <Link href="/signup"><button className="signup-button">Sign Up</button></Link>
        </div>
      </div>

      {/* Top projects */}
      <div className="top-projects">
        <p className="tc">Top Projects</p>
        <button className="show-all-btn">Show all Projects</button>
        {loadingProjects ? (
          <p>Loading projects...</p>
        ) : catError ? (
          <p className="error-message">{catError}</p>
        ) : (
          <section className="projects-grid">
            {projects.map((cat) => (
              <div className="projects-card" key={cat.id}>
                <img src={`http://localhost:5151/CategoriesIcons/${cat.icon}`} alt={cat.name} className="category-icon" />
                <h3>{cat.name}</h3>
                <p>{cat.courseCount} Courses</p>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* Recent Projects */}
      <section className="recent-projects-section">
        <div className="section-header">
          <h2>Recent Projects</h2>
        </div>

        {loadingRecentProjects ? (
          <p>Loading Recent Projects...</p>
        ) : RecentProjectsError ? (
          <p className="error-message">{RecentProjectsError}</p>
        ) : (
          <div className="recent-projects-grid">
            {RecentProjects.map((recentprojects) => (
              <div className="recent-projects-card" key={recentprojects.id}>
                <img src={ `http://localhost:5151/PopularCourses/${course.imageUrl}`} alt={recentprojects.title} className="recent-projects-image" />
                <h3>{recentprojects.title}</h3>
                <div className="rating">
                  {renderStars(recentprojects.rating)}
                  <span className="rating-number">({recentprojects.rating.toFixed(1)})</span>
                </div>
                <div className="duration">
                  <FaClock /> <span>{recentprojects.durationInHours} Hours</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="unolgy-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/images/logo.png" alt="Logo" className="logo" />
            <p className="tagline">
              a leading e-learning platform, harnessing the power of programmers to offer high-quality programming courses.
              Whether you're just starting out or looking to upskill, Unolgy helps you build your career and grow your tech
              knowledge – all for free.
            </p>
            <div className="social-icons">
              <FontAwesomeIcon icon={faFacebook} />
              <FontAwesomeIcon icon={faGoogle} />
              <FontAwesomeIcon icon={faApple} />
            </div>
          </div>
          <div className="footer-profile">
            <h3>Your Profile</h3>
            <ul>
              <li><Link href="/login">Log In</Link></li>
              <li><Link href="/signup">Sign Up</Link></li>
              <li><a href="#">Reset Password</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Public;
