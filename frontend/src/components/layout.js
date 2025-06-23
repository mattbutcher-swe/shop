import React from 'react';
import Navbar from './Navbar';
import './Layout.css';
import '../App.css';

const Layout = ({ header, main, footer }) => {
  return (
    <div className="v-stack-fill">
      <header className="header">
        <Navbar/>
        <h3>{header}</h3>
      </header>
      <main className="body v-grow-scroll">
        <div className='container-lg h-100'>
            {main}
        </div>
      </main>
      {footer && (
        <footer className="footer">
          <div className="container-lg">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
