"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


const NavBar = () => {
    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem('user')) {
            alert('Bạn cần đăng nhập để truy cập trang này!');
            router.push('/admin/login');
            return;
        };
        if (JSON.parse(localStorage.getItem('user')).role !== 'admin') {
            alert('Bạn không có quyền truy cập trang này!');
            router.push('/');
            return;
        };
    }, [router]);

    const [isDropdownOpen, setDropdownOpen] = useState(false);


    function handleLogout() {
        if (confirm('Bạn có chắc chắn muốn đăng xuất?') == true) {
            localStorage.removeItem('user');
            alert('Đăng xuất thành công!');
            router.push('/admin/login');
        };

    }

    return (
        <header
            className="flex justify-between items-center bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4 sticky top-0 z-30 shadow-sm">
            <button id="sidebar-toggle" className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none">
                <i className="fas fa-bars fa-lg"></i>
            </button>
            <div className="flex-grow"></div>
            <div className="flex items-center space-x-4">
                <div className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}>

                    <button id="user-menu-button"
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 focus:outline-none border border-black dark:border-white p-3 rounded-3xl">
                        <i className="fas fa-user"></i>
                        <span className="hidden sm:inline font-semibold"></span>
                        <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                    </button>

                    <div id="user-menu"
                        className={`absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-lg shadow-xl py-1 z-50 border border-gray-200 dark:border-slate-600 transition-all duration-300 ease-in-out transform
                                    ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                        <a href="#"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-600">
                            <i className="fas fa-user-circle w-5 mr-2"></i> Hồ sơ
                        </a>
                        <a href="{{ route('site.home') }}"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-600">
                            <i className="fas fa-home w-5 mr-2"></i> Trang chủ
                        </a>
                        <div className="border-t border-gray-200 dark:border-slate-600 my-1"></div>
                        <button onClick={handleLogout}
                            className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-600">
                            <i className="fas fa-sign-out-alt w-5 mr-2"></i> Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default NavBar