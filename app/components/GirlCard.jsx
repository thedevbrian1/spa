import { Link } from "@remix-run/react";

export default function GirlCard({ src }) {
    return (
        <div
            className="relative w-72 h-72 bg-cover bg-center bg-no-repeat rounded"
            style={{ backgroundImage: `url(${src})` }}
        >
            {/* TODO: Use a form maybe and save the girl's content in a cookie */}
            <Link
                to="/book"
                className="absolute bottom-2 left-4 bg-brand-red px-6 py-2 text-white text-center rounded"
                state={{ name: 'Girl', price: '5000' }}
            >
                Book Now
            </Link>
        </div>
    );
}