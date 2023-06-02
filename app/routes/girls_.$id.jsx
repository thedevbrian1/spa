import Button from "../components/Button";
import { MapPin } from "../components/Icon";
import Image from "../components/Image";

export default function Girl() {
    return (
        <main className="pt-28 w-4/5 xl:max-w-6xl mx-auto">
            <h1 className="text-2xl">Girl</h1>
            <div className="flex text-gray-800 gap-x-2 mt-2">
                <div className="flex gap-x-1">
                    <MapPin />
                    Kilimani
                </div>
                <span className="text-green-500">Available Now</span>
            </div>
            <div className="mt-2 mb-4 flex gap-x-2 items-baseline text-gray-800">
                <span className="font-semibold text-xl">Ksh 5000</span>
                <span>per night</span>
            </div>
            <Button
                text='Book Now'
                href='/book'
                state={{ name: 'Girl', price: '5000' }}
            />
            {/* FIXME: Use carousel of images on mobile instead of displaying a grid (Like airbnb) */}
            <div className="mt-8 md:flex gap-2">
                <Image src='/girl2.jpg' size='large' />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2 lg:mt-0 border border-red-500">
                    <Image src='/girl2.jpg' />
                    <Image src='/girl.jpg' />
                    <Image src='/girl2.jpg' />
                    <Image src='/girl2.jpg' />
                </div>
            </div>
        </main>
    );
}