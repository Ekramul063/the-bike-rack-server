import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Navbar from '../../SharedComponents/Navbar/Navbar';

const DashboardLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <label htmlFor="sidebar" tabIndex={2} className="btn btn-ghost lg:hidden border border-red-600">
                <div className="flex items-center">
                <div className="w-1 h-5 bg-red-400"></div>
                <div className="w-1 h-4 bg-red-500"></div>
                <div className="w-1 h-3 bg-red-600"></div>
                </div>
            </label>
            <div className="drawer drawer-mobile">
                <input id="sidebar" type="checkbox" className="drawer-toggle" />

                <div className="drawer-content ">
                    <Outlet>

                    </Outlet>
                </div>
                <div className="drawer-side">
                    <label htmlFor="sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 bg-base-100 text-base-content">
                        <li><Link to={'/yamaha'}>Yamaha</Link></li>
                        <li><Link to={'/suzuki'}>Suzuki</Link></li>
                        <li><Link to={'/honda'}>Honda</Link></li>
                       
                    </ul>

                </div>
            </div>
          

        </div>
    );
};

export default DashboardLayout;