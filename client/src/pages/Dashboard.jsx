import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashProfile from '../components/DashProfile';
import DashboardSidebar from '../components/DashboardSidebar';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashboardPage from '../components/DashboardPage';

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
    <div className='md:w-56'>
      { /* Sidebar */}
      <DashboardSidebar />
    </div>
    { /* Profile ... */}
    { tab === 'profile' && <DashProfile /> }

    { tab === 'posts' && <DashPosts />}

    
    { tab === 'users' && <DashUsers />}

    { tab === 'comments' && <DashComments />}

    { tab === 'dashboard' && <DashboardPage />}
    </div>
  )
}

export default Dashboard;