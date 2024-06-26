import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Navbar, NavbarToggle, TextInput } from "flowbite-react";
import { Link, useLocation , useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon , FaSun } from "react-icons/fa";
import { useSelector , useDispatch } from "react-redux";
import { toggleTheme } from "../redux_store/theme/themeSlice";
import { signOutSuccess,
} from "../redux_store/user/userSlice.js";

const Header = () => {
  const { currentUser } = useSelector( (state) => state.user);
  const { theme } = useSelector( (state) => state.theme);
  const pathName = useLocation().pathname;
  const dispatch = useDispatch();
  const [searchTerm , setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  
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

const handleSubmit = (e) => {
  e.preventDefault();
  const urlParams = new URLSearchParams(location.search);
  urlParams.set('searchTerm',searchTerm);
  const searchQuery = urlParams.toString();
  navigate(`/search?${searchQuery}`);
};
  
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 rounded-lg text-white">
          Mridul's
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search.."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value = {searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <Button className="w-12 h-10 lg:hidden" color="gray" pill onClick={() => navigate('/search')}>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-3 md:order-4">
        <Button className="w-12 h-10 sm:inline" color="gray" pill onClick={() => dispatch(toggleTheme())}>
          { theme === 'light' ? (<FaMoon />) : (<FaSun />) }
          
        </Button>


        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
              Sign In
            </Button>
          </Link>
        )}

        <NavbarToggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={pathName === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={pathName === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link as={"div"} active={pathName === "/contactus"}>
          <Link to="/contactus">Contact Us</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
