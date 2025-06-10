import React from 'react';
import Layout from '../components/layout';


const Main = () => {
  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <div>
        The page you were looking for doesn't exist.
      </div>
    </div>
  )
};

const NotFound = () => {
  return (
    <Layout
      main={<Main />}
    >
    </Layout>
  );
};

export default NotFound;
