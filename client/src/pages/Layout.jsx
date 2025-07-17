import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import { assets } from '../assets/assets';
import { useUser,SignIn } from '@clerk/clerk-react';

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const {user} = useUser();
  
  if(!user){
    return(
      <div className='flex items-center justify-center h-screen'>
        <SignIn/>
      </div>
    )
  }
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200">
        <img
          src={assets.logo}
          alt="logo"
          className="h-10 cursor-pointer"
          onClick={() => navigate('/')}
        />
        {sidebar ? (
          <X
            onClick={() => setSidebar(false)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        ) : (
          <Menu
            onClick={() => setSidebar(true)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        )}
      </nav>

      {/* Sidebar + Content */}
      <div className="flex flex-1 w-full h-[calc(100vh-56px)] overflow-hidden">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className="flex-1 overflow-y-auto p-4">
         <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
