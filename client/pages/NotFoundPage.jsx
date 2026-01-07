import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '2rem',
      background: 'rgba(26, 26, 26, 0.5)',
      backdropFilter: 'blur(15px)',
      margin: '2rem',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h1 style={{ fontSize: '4rem', color: '#00d4ff', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: '#b0b0b0', marginBottom: '2rem', maxWidth: '600px' }}>
        We're still building this page. Please continue exploring our other amazing features!
      </p>
      <Link 
        to="/" 
        style={{
          background: 'linear-gradient(45deg, #00d4ff, #00aefd)',
          color: '#000',
          padding: '1rem 2rem',
          borderRadius: '50px',
          textDecoration: 'none',
          fontWeight: '600',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-3px) scale(1.05)';
          e.target.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.4)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'none';
          e.target.style.boxShadow = 'none';
        }}
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
