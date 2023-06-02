import { Form, Link, isRouteErrorResponse, useMatches, useNavigation, useRouteError } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import ErrorHeading from "../components/ErrorHeading";
import Button from "../components/Button";
import Heading from "../components/Heading";
import { TrashIcon } from "../components/Icon";
import { deleteImage } from "../models/image.server";
import { deleteCloudinaryImage } from "../services/cloudinary.server";
import DeletableImage from "../components/DeletableImage";
import { getCloudinaryPublicId } from "../utils";

export async function action({ request }) {
    const formData = await request.formData();
    const imageId = formData.get('imageId');
    const imageUrl = formData.get('url');

    const publicId = getCloudinaryPublicId(imageUrl);

    // Delete image from db
    await deleteImage(imageId);

    // Delete image from cloudinary
    const deleted = await deleteCloudinaryImage(publicId);
    console.log({ deleted });

    return redirect('/profile/photos');
}

export default function Photos() {
    const navigation = useNavigation();

    const isSubmitting = navigation.state === 'submitting';

    const matches = useMatches();

    const { user } = matches[1].data;
    console.log({ user });

    return (
        <div>
            {user.girl.images.length === 0
                ? (<div className="w-full h-screen grid place-items-center lg:pb-20">
                    <div>
                        <div className="w-32 h-32">
                            <img
                                src="/space.svg"
                                alt=""
                                className="w-full h-full"
                            />
                        </div>
                        <p className="mb-4 text-lg text-gray-800">No photos</p>
                        <Link to="add" className="bg-green-600 text-white px-4 py-2 rounded">
                            Add photos
                        </Link>
                    </div>
                </div>)
                : (<div className="max-w-5xl">
                    <div className="flex justify-between items-center">
                        <Heading text='Photos' />
                        <Button href='add' text='Add photo' />
                    </div>
                    <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-4">
                        {user.girl.images.map((image, index) => (
                            <DeletableImage key={index} url={image.url} id={image.id} />
                        ))}
                    </div>
                </div>)
            }

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