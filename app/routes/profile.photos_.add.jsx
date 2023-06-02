import { json, unstable_composeUploadHandlers, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, Link, isRouteErrorResponse, useActionData, useNavigation, useRouteError } from "@remix-run/react";
import { useState } from "react";
import { badRequest, validateImageSrc } from "../utils";
import { uploadImage } from "../services/cloudinary.server";
import ImageUpload from "../components/ImageUpload";
import ErrorHeading from "../components/ErrorHeading";
import { getUserByEmail, getUserById } from "../models/user.server";
import { getUser } from "../session.server";
import { addImage } from "../models/image.server";
import Heading from "../components/Heading";
import { ArrowLeftIcon } from "../components/Icon";

// export async function loader() {
//     throw new Response('Kaboom!!', {
//         status: 400
//     });
// }

export async function action({ request }) {
    const uploadHandler = unstable_composeUploadHandlers(
        async ({ name, data }) => {
            if (name !== "image") {
                return undefined;
            }
            const uploadedImage = await uploadImage(data);
            // console.log({ uploadedImage });
            return uploadedImage.secure_url;
        },
        unstable_createMemoryUploadHandler()
    );

    const formData = await unstable_parseMultipartFormData(request, uploadHandler);
    const image = formData.getAll('image');

    // console.log({ image });

    // const fieldErrors = {
    //     imageSrc: validateImageSrc(image.url)
    // };
    // if (Object.values(fieldErrors).some(Boolean)) {
    //     return badRequest({ fieldErrors });
    // }

    const user = await getUser(request);

    if (image.length > 1) {
        for (let current of image) {
            await addImage(current, user.girl.id);
        }
    } else {
        await addImage(image[0], user.girl.id,);
    }

    return json({ image });
}

export default function AddPhoto() {
    const actionData = useActionData();
    const navigation = useNavigation();

    const isSubmitting = navigation.state === 'submitting';
    const [images, setImages] = useState([]);

    function handleImageChange(event) {
        const files = event.target.files;

        // console.log({ files });

        let imagesArray = [];

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = () => {
                imagesArray.push(reader.result);
                if (imagesArray.length === files.length) {
                    setImages([...imagesArray]);
                }
            };
            reader.readAsDataURL(files[i]);

        }
    }

    // console.log({ images: actionData?.image });

    return (
        <div>
            <Link to="/profile/photos" className="text-gray-800 hover:text-blue-500 flex gap-x-2 mb-4">
                <ArrowLeftIcon /> Back to photos
            </Link>
            <Heading text='Upload photos' />
            <p className="text-gray-500">(Min 3 photos)</p>
            <div>
                <div className="mt-8">
                    <Form method="post" encType="multipart/form-data" className="max-w-lg border border-red-500">
                        <fieldset >
                            <div className="grid md:grid-cols-2 lg:grid-cols-3  gap-4">
                                {/* {Array(3).fill(1).map((_, index) => (
                                    <ImageUpload key={index} image={images[index]} handleImageChange={handleImageChange} />

                                ))} */}
                                {/* TODO: Add image more than once e.g use an 'Add image' button to open another file opener */}
                                <div className="border border-green-500 w-56">
                                    {/* <label htmlFor="image">Add image(s)</label> */}
                                    <input
                                        type="file"
                                        name="image"
                                        id="image"
                                        accept="image/png, image/jpg, image/jpeg"
                                        onChange={handleImageChange}
                                        aria-label="add image"

                                        multiple
                                    />
                                </div>
                            </div>

                            <div>
                                {images.length > 0 && (
                                    <div className="mt-2">
                                        <h3 className="text-gray-800">Selected images:</h3>
                                        <div className="flex gap-2 flex-wrap mt-2">
                                            {images.map((image, index) => (
                                                <div className="w-32 h-32" key={index}>
                                                    <img
                                                        src={image}
                                                        alt={`Uploaded ${index}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded">{isSubmitting ? 'Uploading...' : 'Upload'}</button>
                        </fieldset>
                    </Form>
                    {actionData?.fieldErrors?.imageSrc
                        ? (<span className="text-red-500">{actionData?.fieldErrors.imageSrc}</span>)
                        : null
                    }
                    <div className="mt-8">
                        {actionData?.image.length > 0
                            ? (
                                <div>
                                    <h3 className="text-gray-800">Uploaded images:</h3>
                                    <div className="flex gap-2 flex-wrap max-w-xl mt-2">
                                        {actionData?.image.map((image, index) => (
                                            <div className="w-20 h-20" key={index}>
                                                <img
                                                    src={image}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>)
                            : null
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        console.log({ error: error.data });
        return (
            <div className="w-full h-screen grid place-items-center pb-20">
                <div>
                    <ErrorHeading text={`${error.status} ${error.statusText}`} />
                    <Link to="/profile/photos" className="underline text-gray-800">
                        Try again
                    </Link>
                </div>
            </div>
        );
    } else if (error instanceof Error) {
        console.log({ error: error.message });
        console.log({ stackTrace: error.stack });
        return (
            <div className="w-full h-screen grid place-items-center pb-20">
                <div>
                    <div className="w-32 lg:w-40 h-32 lg:h-40">
                        <img
                            src="/error.svg"
                            alt=""
                            className="w-full h-full"
                        />
                    </div>
                    <ErrorHeading text='Error' />
                    <Link to="/profile/photos" className="underline text-gray-800">
                        Try again
                    </Link>
                </div>
            </div>
        );
    } else return <h1>Unknown error</h1>
}