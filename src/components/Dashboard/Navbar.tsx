import { getMeUser } from '@/helpers/api/baseUrl';
import { config } from '@/helpers/functions/token';
import { geodeziyaLogo } from '@/helpers/imports/images';
import { GetMeResponse } from '@/helpers/types/GetMetype';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { IoExitOutline } from 'react-icons/io5';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import LogoutModal from '@/components/Modal/LogoutModal';
import AOS from 'aos';

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isEmailTooltipVisible, setIsEmailTooltipVisible] = useState<boolean>(false);
  const role = localStorage.getItem('role');

  // ======= START Log out uchun button
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/auth/SignIn');
  };
  // ======= END Log out uchun button

  const toggleDropdown = () => {
    if (!getMe.isLoading) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  // Modal Hover bolganda email ni ko'rsatish
  const handleMouseEnter = () => {
    setIsEmailTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setIsEmailTooltipVisible(false);
  };

  // Open Logout Modal
  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  // Close Logout Modal
  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const getMe = useQuery({
    queryKey: ['getMe', config],
    queryFn: async (): Promise<any> => {
      const res = await axios.get(getMeUser, config);
      return res.data;
    },
  });

  const getMeData: GetMeResponse = getMe.data?.body;
  // useEffect(() => {
  //   getMe.refetch();
  // }, [getMe.refetch]);
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    AOS.init({ duration: 500 }); // Aos uchun
  }, []);

  return (
    <nav className="bg-white border-b shadow p-6 flex justify-end items-center">
      <div className="flex justify-between items-center">
        <div
          className={`relative ${getMe.isLoading ? 'pointer-events-none opacity-50' : ''
            }`}
          onClick={toggleDropdown}
        >
          <div className="flex gap-4 items-center cursor-pointer">
            <div>
              <h1 className="text-gray-500 mr-2 text-md font-semibold">
                {getMeData?.fullName}
              </h1>
              <span>
                {getMe.isLoading
                  ? 'Loading...'
                  : (role === 'ROLE_SUPER_ADMIN' && 'super admin') ||
                  (role === 'ROLE_TESTER' && 'tester') ||
                  (role === 'ROLE_USER' && 'client')}
              </span>
            </div>
            <div>
              <img
                src={geodeziyaLogo}
                alt="Admin logo"
                className="rounded-full w-10"
              />
            </div>
          </div>

          {isDropdownOpen && (
            <div className="absolute z-50 right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg">
              <div className="p-4">
                <div className="font-bold">{getMeData.fullName}</div>
                {/* Email with hover effect */}
                <div
                  className="text-md w-full text-left pt-5 pb-2 rounded"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {getMeData.email}
                </div>
                {/* Tooltip email */}
                {isEmailTooltipVisible && (
                  <div data-aos="fade-up" className="absolute bg-gray-200 p-2 top-[9px] left-3 rounded shadow-md">
                    {getMeData.email}
                  </div>
                )}
              </div>
              <hr />
              <div>
                <Link to={'/profile'}>
                  <button
                    className={`flex items-center gap-2 w-full text-left hover:bg-gray-100 px-3 py-5 rounded ${getMe.isLoading ? 'pointer-events-none opacity-50' : ''
                      }`}
                    disabled={getMe.isLoading}
                  >
                    <FaRegUser />
                    Profil
                  </button>
                </Link>
                <button
                  className={`flex items-center gap-2 w-full text-left hover:bg-gray-100 px-3 py-5 rounded ${getMe.isLoading ? 'pointer-events-none opacity-50' : ''
                    }`}
                  onClick={openLogoutModal}
                  disabled={getMe.isLoading}
                >
                  <IoExitOutline />
                  Chiqish
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logout Confirmation Modal */}
        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={closeLogoutModal}
          onLogout={logOut}
        />
      </div>
    </nav>
  );
};

export default Navbar;
