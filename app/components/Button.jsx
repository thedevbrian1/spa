import { Link } from "@remix-run/react";

export default function Button({ text, href }) {
    return (
        <Link
            to={href}
            className="bg-brand-red px-6 py-3 text-white text-center rounded"
        >
            {text}
        </Link>
    );
}