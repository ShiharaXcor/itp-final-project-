import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets.js'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext.jsx'

const Navbar = () => {

    const [visible,setVisible] = useState(false);
    const{getCartCount} = useContext(ShopContext);

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
        <Link to='/'>
        <img src={assets.logo} className='w-16 h-auto' /></Link>
        <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>

            <NavLink to='/home' className='flex flex-col items-center gap-1'>
                <p>Home</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />

            </NavLink>
            <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                <p>Collection</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />

            </NavLink>
            <NavLink to='/about' className='flex flex-col items-center gap-1'>
                <p>About</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />

            </NavLink>
            <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                <p>Contact</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />

            </NavLink>




        </ul>


        <div className='flex items-center gap-6'>
            <img src={assets.search_icon} className='w-5 cursor-pointer' alt=""/>

            <div className='group relative'>
                <img className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
                <div  className='group-hover:block hidden absolute dropdown-menu right-0 pt-4' >
                    <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded' >
                        <p className='cursor-pointer hover:text-black'>My Profile</p>
                        <NavLink to='/orderlist'> <p className='cursor-pointer hover:text-black'>Orders</p></NavLink>
                        <NavLink to='/#'><p className='cursor-pointer hover:text-black'>Reimbursement</p></NavLink>
                        <NavLink to='/logout'><p className='cursor-pointer hover:text-black'>Logout</p></NavLink>

                    </div>
                </div>


            </div>
            <Link to='/cart' className='relative'>
            <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full-text-[8px]'>{getCartCount()}</p>
            </Link>

        </div>
             
    </div>
  )
}

export default Navbar