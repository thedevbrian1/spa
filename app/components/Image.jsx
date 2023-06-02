export default function Image({ src, alt, size }) {
    return (
        <div className={`${size === 'large' ? 'max-w-xl aspect-video lg:w-[400px] lg:h-96' : 'max-w-xl aspect-video lg:w-64 lg:h-[187px]'}`}>
            <img
                src={src}
                alt=""
                className="w-full h-full object-cover rounded"
            />
        </div>
    );
}