import { NavLink, useLocation } from "@remix-run/react";
import { useState } from "react"
// import { navLinks } from "~/utils";

export default function Nav({ hash, setHash }) {
    const location = useLocation();
    const path = location.pathname;

    const [isMenuShowing, setIsMenuShowing] = useState(false);

    // function handleHash(navlink) {
    //     if (navlink.path.includes('#contact')) {
    //         setHash('contact');
    //     } else {
    //         setHash();
    //     }
    // }
    return (
        <nav className="text-black pr-5 lg:pr-8 font-body">
            {/* Mobile menu */}
            <div className="lg:hidden">
                <div className="w-6 h-6">
                    <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => setIsMenuShowing(true)}
                    >
                        <g id="menu">
                            <path id="topLine" d="M19.1667 10.8161H0.833333C0.373332 10.8161 0 10.4427 0 9.98275C0 9.52275 0.373332 9.14941 0.833333 9.14941H19.1667C19.6267 9.14941 20 9.52275 20 9.98275C20 10.4427 19.6267 10.8161 19.1667 10.8161Z" fill="black" />
                            <path id="midLine" d="M19.1667 4.42692H0.833333C0.373332 4.42692 0 4.05359 0 3.59359C0 3.13359 0.373332 2.76025 0.833333 2.76025H19.1667C19.6267 2.76025 20 3.13359 20 3.59359C20 4.05359 19.6267 4.42692 19.1667 4.42692Z" fill="black" />
                            <path id="bottomLine" d="M19.1667 17.2048H0.833333C0.373332 17.2048 0 16.8314 0 16.3714C0 15.9114 0.373332 15.5381 0.833333 15.5381H19.1667C19.6267 15.5381 20 15.9114 20 16.3714C20 16.8314 19.6267 17.2048 19.1667 17.2048Z" fill="black" />
                        </g>
                    </svg>
                </div>
                {
                    isMenuShowing && (
                        <div className="flex flex-col justify-center items-center gap-y-3 bg-black opacity-90 w-full h-screen fixed z-10 top-0 left-0 transition duration-500 ease-in-out">
                            <div className="w-6 h-6 absolute top-7 right-12">
                                <svg
                                    viewBox="0 0 16 17"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    onClick={() => setIsMenuShowing(false)}
                                >
                                    <g id="close">
                                        <path id="line1" d="M14.3625 2.39995L1.88291 15.8302C1.56979 16.1672 1.04217 16.1865 0.705194 15.8734C0.368215 15.5603 0.348855 15.0327 0.66198 14.6957L13.1415 1.26544C13.4547 0.928462 13.9823 0.909103 14.3193 1.22223C14.6562 1.53535 14.6756 2.06297 14.3625 2.39995Z" fill="white" />
                                        <path id="line2" d="M13.3581 16.2953L1.32777 2.46126C1.02591 2.11415 1.06264 1.58746 1.40975 1.2856C1.75686 0.983751 2.28356 1.02048 2.58541 1.36759L14.6158 15.2016C14.9176 15.5488 14.8809 16.0755 14.5338 16.3773C14.1867 16.6792 13.66 16.6424 13.3581 16.2953Z" fill="white" />
                                    </g>
                                </svg>
                            </div>
                            <ul className='list-none text-center mr-4 text-white'>
                                {/* {navLinks.map((navLink) => (
                                    <li
                                        className='text-xl'
                                        key={navLink.id}
                                        onClick={() => setIsMenuShowing(false)}
                                    >
                                        <NavLink
                                            to={navLink.path}
                                            prefetch='intent'
                                            end
                                            className={({ isActive }) => isActive ? 'underline' : ''}
                                        >
                                            {navLink.name}
                                        </NavLink>
                                    </li>
                                ))} */}
                                <li className="hover:text-brand-yellow transition duration-300 ease-in-out">
                                    <NavLink
                                        to="/"
                                        end
                                        prefetch="intent"
                                        className={({ isActive }) => isActive ? 'text-brand-red' : path === '/' ? 'text-white' : ''}
                                    >
                                        Home
                                    </NavLink>
                                </li>
                                <li className="hover:text-brand-yellow transition duration-300 ease-in-out">
                                    <NavLink
                                        to="/girls"
                                        end
                                        prefetch="intent"
                                        onClick={() => setHash()}
                                        className={({ isActive }) => (isActive && hash !== 'contact') ? 'text-brand-red' : path === '/' ? 'text-white' : ''}
                                    >
                                        Girls
                                    </NavLink>
                                </li>
                                <li className="hover:text-brand-yellow transition duration-300 ease-in-out">
                                    <NavLink
                                        to="/contact"
                                        end
                                        prefetch="intent"
                                        onClick={() => setHash('products')}
                                        className={({ isActive }) => (isActive && hash === 'products') ? 'text-brand-red' : path === '/' ? 'text-white' : ''}
                                    >
                                        Contact Us
                                    </NavLink>
                                </li>

                            </ul>
                        </div>
                    )
                }
            </div>
            {/* Desktop menu */}
            <ul className="text-black hidden lg:flex gap-6">
                {/* {navLinks.map((navLink) => (
                    <li key={navLink.id} className="hover:text-red-600 transition duration-300 ease-in-out">
                        <NavLink
                            to={navLink.path}
                            prefetch="intent"
                            end
                            onClick={() => handleHash(navLink)}
                            className={({ isActive }) => (isActive && location.pathname !== '/about')
                                ? 'text-red-500'
                                : (isActive && hash === 'contact')
                                    ? 'text-red-500'
                                    : (isActive && hash !== 'contact')
                                        ? 'text-red-500'
                                        : ''
                            }
                        >
                            {navLink.name}
                        </NavLink>
                    </li>
                ))} */}

                <li className="hover:text-brand-yellow transition duration-300 ease-in-out">
                    <NavLink
                        to="/"
                        end
                        prefetch="intent"
                        className={({ isActive }) => isActive ? 'text-brand-red' : path === '/' ? 'text-white' : ''}
                    >
                        Home
                    </NavLink>
                </li>
                <li className="hover:text-brand-yellow transition duration-300 ease-in-out">
                    <NavLink
                        to="/girls"
                        end
                        prefetch="intent"
                        onClick={() => setHash()}
                        className={({ isActive }) => (isActive && hash !== 'contact') ? 'text-brand-red' : path === '/' ? 'text-white' : ''}
                    >
                        Girls
                    </NavLink>
                </li>
                <li className="hover:text-brand-yellow transition duration-300 ease-in-out">
                    <NavLink
                        to="/contact"
                        end
                        prefetch="intent"
                        onClick={() => setHash('products')}
                        className={({ isActive }) => (isActive && hash === 'products') ? 'text-brand-red' : path === '/' ? 'text-white' : ''}
                    >
                        Contact Us
                    </NavLink>
                </li>

            </ul>
        </nav>
    );
}