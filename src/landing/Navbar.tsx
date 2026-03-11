import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <div className="nav-brand-icon">◆</div>
          <span className="nav-brand-text">DOS Shield</span>
        </Link>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#models">Models</a>
          <a href="#analytics">Analytics</a>
          <a href="#developer">API</a>
        </div>

        <Link to="/dashboard" className="nav-cta">
          Start Testing →
        </Link>
      </div>
    </nav>
  );
}
