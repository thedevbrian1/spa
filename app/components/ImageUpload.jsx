import { useState } from "react";

export default function ImageUpload({ image, handleImageChange }) {
    // const [image, setImage] = useState('');

    // function handleImageChange(event) {
    //     const file = event.target.files[0];
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //         setImage(reader.result);
    //     }

    //     if (file) {
    //         reader.readAsDataURL(file);
    //     }
    // }
    return (
        <div className="flex flex-col border border-green-500">
            <label
                htmlFor="image"
                className={`max-w-xs h-32 ${image ? 'bg-no-repeat' : 'bg-gray-100'}  bg-cover bg-center rounded text-center text-gray-800`}
                style={{ backgroundImage: `url(${image})` }}
            >
                {!image && (
                    <span>Add image</span>
                )}
                <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={handleImageChange}
                    className="opacity-0"
                    multiple
                />
            </label>

        </div>
    );
}