import { Form, isRouteErrorResponse, useActionData, useNavigation, useRouteError, useSearchParams } from "@remix-run/react";
// import { json, unstable_composeUploadHandlers, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";

import Input from "../components/Input";
import { useRef } from "react";
import Label from "../components/Label";
import { badRequest, safeRedirect, trimPhone, validateEmail, validateImageSrc, validateName, validatePassword, validatePhone } from "../utils";
import { createUser } from "../models/user.server";
import { createGirl } from "../models/girl.server";
import Button from "../components/Button";
import { redirect } from "@remix-run/node";
import { createUserSession } from "../session.server";

export function meta() {
    return [
        { title: 'Signup | Spa' }
    ];
}

// export async function loader() {
//     throw new Response('Error message', {
//         status: 400
//     });

// }

export async function action({ request }) {
    const formData = await request.formData();
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const redirectTo = safeRedirect(formData.get("redirectTo"), "/success");


    const trimmedPhone = trimPhone(phone);

    // Validation
    const fieldErrors = {
        name: validateName(name),
        phone: validatePhone(trimmedPhone),
        email: validateEmail(email),
        password: validatePassword(password),
        confirmPassword: validatePassword(confirmPassword)
    };

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors });
    }

    if (password !== confirmPassword) {
        return badRequest({
            formError: {
                password: 'Passwords do not match'
            }
        });
    }

    // Create user then create girl

    const user = await createUser(email, password);
    const userId = user.id;

    console.log({ userId });

    const girl = await createGirl(name, phone, userId);
    console.log({ girl });

    // return redirect('/success');
    return createUserSession({ redirectTo, remember: false, request, userId })

}

export default function SignUp() {
    const actionData = useActionData();
    const navigation = useNavigation();

    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") ?? undefined;

    const isSubmitting = navigation.state === 'submitting';

    const nameRef = useRef(null);
    const phoneRef = useRef(null);
    const emailRef = useRef(null);
    // const ageRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    return (
        <main className="pt-24 lg:pt-36 w-4/5 xl:max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center ">Sign up</h1>
            {/* Display form with email and password only or sign up with google */}

            <Form method="post" className="mt-3 max-w-2xl mx-auto">
                <fieldset className="">
                    <section>
                        {/* <h2 className="font-semibold text-gray-800">Personal info</h2> */}
                        <div className="mt-1 lg:grid lg:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name" text='Name' />
                                <Input
                                    ref={nameRef}
                                    type='text'
                                    name='name'
                                    id='name'
                                    placeholder='Jane Doe'
                                    fieldError={actionData?.fieldErrors?.name}
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone" text='Phone' />
                                <Input
                                    ref={phoneRef}
                                    type='text'
                                    name='phone'
                                    id='phone'
                                    placeholder='0712 345 678'
                                    fieldError={actionData?.fieldErrors?.phone}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email" text='Email' />
                                <Input
                                    ref={emailRef}
                                    type='email'
                                    name='email'
                                    id='email'
                                    placeholder='janedoe@gmail.com'
                                    fieldError={actionData?.fieldErrors?.email}
                                />
                            </div>
                            {/* <div>
                                <Label htmlFor='age' text='Age' />
                                <Input
                                    ref={ageRef}
                                    type='number'
                                    name='age'
                                    id='age'
                                    // placeholder='John Doe'
                                    fieldError={actionData?.fieldErrors.age}
                                />
                            </div> */}
                            <div>
                                <Label htmlFor='password' text='Password' />
                                <Input
                                    ref={passwordRef}
                                    type="password"
                                    name="password"
                                    id="password"
                                    fieldError={actionData?.fieldErrors?.password}
                                    formError={actionData?.formError}
                                />
                            </div>
                            <div>
                                <Label htmlFor='confirmPassword' text='Confirm Password' />
                                <Input
                                    ref={confirmPasswordRef}
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    fieldError={actionData?.fieldErrors?.confirmPassword}
                                    formError={actionData?.formError}
                                />
                            </div>
                            <input type="hidden" name="redirectTo" value={redirectTo} />
                        </div>
                    </section>

                </fieldset>

                {actionData?.formError ? (
                    <span className="text-red-500 block">
                        {actionData?.formError.password}
                    </span>
                ) : <>&nbsp;</>
                }

                <button type="submit" className="bg-green-600 mt-2 px-6 py-2 text-center text-white rounded">
                    {isSubmitting ? 'Processing...' : 'Sign up'}
                </button>

            </Form>

            {/* or log in with Google */}
            <Form>

            </Form>

        </main>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <div className="w-full h-screen grid place-items-center">
                <div>
                    <h1>{error.status} {error.statusText}</h1>
                    <div className="flex flex-col gap-4">
                        <p className="text-3xl font-semibold">{error.data}</p>
                        <Button text="Back to signup" href="/signup" />
                    </div>
                </div>
            </div>
        );
    } else if (error instanceof Error) {
        console.log({ error: error.message });
        console.log({ stackTrace: error.stack });
        return (
            <div className="w-full h-screen grid place-items-center">
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-semibold">Error</h1>
                    <Button text='Back to signup' href='/signup' />
                </div>
            </div>
        );
    } else {
        return (
            <div className="w-full h-screen grid place-items-center">
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-semibold">Unknown error!</h1>
                    <Button text='Back to signup' href='/signup' />
                </div>
            </div>
        );
    }
}