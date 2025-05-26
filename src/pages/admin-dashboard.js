import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function AdminDashboard() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Theme initialization logic
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <>
      <Head>
        <title>Modern Admin Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav>
          <ul>
            <li className="active">Dashboard</li>
            <li>Analytics</li>
            <li>Reports</li>
            <li>Settings</li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button>Logout</button>
        </div>
      </div>

      <main className="main-content">
        <header>
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <button>Search</button>
          </div>
          <div className="user-info">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="avatar"
            />
          </div>
        </header>

        <div className="dashboard">
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <button>Add New</button>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>john@example.com</td>
                  <td>Active</td>
                  <td>
                    <a href="#">Edit</a> | <a href="#">Delete</a>
                  </td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button disabled>Previous</button>
            <button>Next</button>
          </div>
        </div>
      </main>

      <style jsx global>{`
        :root {
          --sidebar-width: 220px;
          --primary: #2563eb;
          --primary-dark: #1e40af;
          --bg: #f4f6fb;
          --white: #fff;
          --gray: #e5e7eb;
          --text: #22223b;
          --shadow: 0 2px 8px rgba(0,0,0,0.04);
          --card-bg: #ffffff;
          --hover-bg: #e0e7ff;
        }

        [data-theme="dark"] {
          --bg: #1a1b1e;
          --text: #ffffff;
          --white: #2d2e32;
          --gray: #3f4046;
          --card-bg: #2d2e32;
          --hover-bg: #3f4046;
          --shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background: var(--bg);
          color: var(--text);
          display: flex;
          min-height: 100vh;
          transition: background-color 0.3s, color 0.3s;
        }
        .sidebar {
          width: var(--sidebar-width);
          background: var(--white);
          box-shadow: var(--shadow);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px 0;
          position: fixed;
          height: 100vh;
          transition: background-color 0.3s;
        }
        .sidebar-header { text-align: center; margin-bottom: 32px; }
        .sidebar-header h2 { color: var(--primary); font-size: 1.5rem; font-weight: 700; }
        .sidebar nav ul { list-style: none; }
        .sidebar nav ul li {
          padding: 14px 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text);
          transition: background 0.2s, color 0.2s;
        }
        .sidebar nav ul li.active,
        .sidebar nav ul li:hover {
          background: var(--primary);
          color: var(--white);
        }
        .sidebar-footer { text-align: center; margin-top: 32px; }
        .sidebar-footer button {
          background: var(--primary);
          color: var(--white);
          border: none;
          padding: 10px 32px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s;
        }
        .sidebar-footer button:hover { background: var(--primary-dark); }
        .main-content {
          margin-left: var(--sidebar-width);
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px 0 32px;
          background: var(--bg);
          transition: background-color 0.3s;
        }
        .search-bar { display: flex; gap: 8px; }
        .search-bar input {
          padding: 8px 12px;
          border: 1px solid var(--gray);
          border-radius: 4px;
          font-size: 1rem;
          background: var(--white);
          color: var(--text);
          transition: background-color 0.3s, color 0.3s;
        }
        .search-bar button {
          background: var(--primary);
          color: var(--white);
          border: none;
          padding: 8px 18px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s;
        }
        .search-bar button:hover { background: var(--primary-dark); }
        .user-info { 
          display: flex; 
          align-items: center; 
          gap: 12px;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid var(--primary);
          cursor: pointer;
        }
        .dashboard { padding: 32px; flex: 1; }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .dashboard-header h1 { font-size: 2rem; font-weight: 700; }
        .dashboard-header button {
          background: var(--primary);
          color: var(--white);
          border: none;
          padding: 10px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s;
        }
        .dashboard-header button:hover { background: var(--primary-dark); }
        .table-responsive {
          background: var(--card-bg);
          border-radius: 10px;
          box-shadow: var(--shadow);
          overflow-x: auto;
          margin-bottom: 24px;
          transition: background-color 0.3s;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }
        th, td { padding: 14px 16px; text-align: left; }
        th { background: var(--bg); font-weight: 600; }
        tr:nth-child(even) { background: var(--hover-bg); }
        tr:hover { background: var(--hover-bg); }
        a { color: var(--primary); text-decoration: none; font-weight: 500; }
        .pagination {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 16px;
        }
        .pagination button {
          background: var(--primary);
          color: var(--white);
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s;
        }
        .pagination button:hover { background: var(--primary-dark); }
        .pagination button:disabled {
          background: var(--gray);
          cursor: not-allowed;
        }
        .theme-toggle {
          background: none;
          border: none;
          color: var(--text);
          cursor: pointer;
          font-size: 1.5rem;
          padding: 8px;
          margin-left: 16px;
        }
      `}</style>
    </>
  );
} 