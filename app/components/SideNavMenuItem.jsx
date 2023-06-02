import { NavLink, useLocation } from "@remix-run/react";

export default function SideNavMenuItem({ href, text, icon }) {
    const { pathname } = useLocation();

    return (
        <li className="h-12">
            <NavLink
                to={href}
                className={({ isActive }) => `pl-4 h-full flex items-center ${isActive ? 'text-blue-600 bg-slate-200' : ''}`}
                prefetch="intent"
                end
            >
                {icon} <span className="ml-2">{text}</span>
            </NavLink>
        </li>
    );
}