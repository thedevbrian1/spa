import { Form, Link, isRouteErrorResponse, useActionData, useMatches, useNavigation, useRouteError } from "@remix-run/react";
import { useRef } from "react";
import Input from "../components/Input";
import Label from "../components/Label";
import { badRequest, trimPhone, validateName, validatePhone } from "../utils";
import { getUser, getUserId } from "../session.server";
import { updateProfile } from "../models/girl.server";
import { redirect } from "@remix-run/node";
import ErrorHeading from "../components/ErrorHeading";

export async function action({ request }) {
    const formData = await request.formData();
    const name = formData.get('name');
    const phone = formData.get('phone');

    console.log({ name });
    console.log({ phone });

    const trimmedPhone = trimPhone(phone);

    // Return errors if any
    const fieldErrors = {
        name: validateName(name),
        phone: validatePhone(trimmedPhone)
    }

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors });
    }

    const user = await getUser(request);
    const girlId = user.girl.id;

    await updateProfile(girlId, name, phone);

    return redirect('/profile/edit');
}

// TODO: Add toast to display success status
export default function Edit() {
    const actionData = useActionData();
    const matches = useMatches();

    const { user } = matches[1].data;

    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    const nameRef = useRef(null);
    const phoneRef = useRef(null);
    // const emailRef = useRef(null);

    return (
        <div>
            <h2 className="font-semibold text-gray-800 text-lg">Edit profile</h2>
            <Form method="post" className="max-w-2xl border border-red-500">
                <fieldset>
                    <div className="grid lg:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor='name' text='Name' />
                            <Input
                                ref={nameRef}
                                type='text'
                                name='name'
                                id='name'
                                // placeholder='Jane Doe'
                                defaultValue={user.girl.name}
                                fieldError={actionData?.fieldErrors.name}
                            />
                        </div>
                        {/* <div>
                        <Label htmlFor='email' text='Email' />
                        <Input
                            ref={emailRef}
                            type='email'
                            name='email'
                            id='email'
                            placeholder='janedoe@email.com'
                            fieldError={actionData?.fieldErrors.email}
                        />
                    </div> */}
                        <div>
                            <Label htmlFor='phone' text='Phone' />
                            <Input
                                ref={phoneRef}
                                type='text'
                                name='phone'
                                id='phone'
                                placeholder='0712 345 678'
                                defaultValue={user.girl.phone}
                                fieldError={actionData?.fieldErrors.phone}
                            />
                        </div>
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded">
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </fieldset>
            </Form>
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