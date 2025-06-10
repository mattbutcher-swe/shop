import React from 'react';
import Navbar from './Navbar';
import './layout.css';

const Layout = ({ header, main, footer }) => {
  return (
    <div className="v-stack-fill">
      <header className="header">
        <Navbar/>
        <h2>{header}</h2>
      </header>
      <main className="body v-grow-scroll container-lg">
        {main}
      </main>
      <footer className="footer">
        <div className='container-lg'>
            {footer}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
