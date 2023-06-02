export default function Label({ htmlFor, text }) {
    return (
        <label htmlFor={htmlFor} className="text-gray-800">{text}</label>
    );
}