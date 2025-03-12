import React from 'react';

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>IDOYOUDO</div>
      <ul style={styles.navLinks}>
        <li style={styles.navItem}>
          <a href="/wedplan" style={styles.navLink}>Wedplan</a>
        </li>
        <li style={styles.navItem}>
          <a href="/calendar" style={styles.navLink}>Calendar</a>
        </li>
        <li style={styles.navItem}>
        <a href="/login" style={styles.navLink}><i className="fas fa-sign-out-alt"/></a>
        </li>
      </ul>
    </nav>
  );
}

// Stiluri inline integrate
const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'Tims New Roman', serif",
    backgroundColor: 'transparent',
    zIndex: 1000,
    boxShadow: 'none',
  },
  logo: {
    fontSize: '25px',
    color: '#6d463e',
    fontWeight: 'bold',
  },
  navLinks: {
    display: 'flex',
    gap: '40px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navItem: {
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  navLink: {
    textDecoration: 'none',
    color: '#6d463e',
    transition: 'color 0.2s',
  },
  navLinkHover: {
    color: '#d9534f',
  },
  searchIcon: {
    fontSize: '20px',
    color: '#6d463e',
  },
};

export default Navbar;
