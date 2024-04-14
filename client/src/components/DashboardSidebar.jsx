import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight} from 'react-icons/hi';
import { signOutSuccess,
} from "../redux_store/user/userSlice.js";
import { useDispatch } from 'react-redux';

const DashboardSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try{
      const res = await fetch('/api/user/signout',{
          method: "POST",
      });
      
      const data = await res.json();
      if(!res.ok){
          console.log(data.message);
      } else {
          dispatch(signOutSuccess());
      }
    }catch(err){
      console.log(err.message);
    }
};

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={ tab === 'profile'} icon={ HiUser } label={"User"} labelColor='dark'  as='div'>
              Profile
            </Sidebar.Item>
            </Link>
            <Sidebar.Item active icon={ HiArrowSmRight } className='cursor-pointer' onClick={handleSignOut}>
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashboardSidebar