import { Form, Link, Outlet, useActionData, useMatches, useNavigation } from "@remix-run/react";
import Label from "../components/Label";
import Input from "../components/Input";
import { useRef } from "react";
import { badRequest, validateEmail } from "../utils";
import { updateEmail } from "../models/user.server";
import { getUserId } from "../session.server";

export async function action({ request }) {
    const formData = await request.formData();
    const email = formData.get('email');

    const fieldErrors = {
        email: validateEmail(email),
    };

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors });
    }

    const userId = await getUserId(request);
    await updateEmail(userId, email);

    return null;
}

export default function Account() {
    const actionData = useActionData();

    const matches = useMatches();
    const { user } = matches[1].data;

    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    const emailRef = useRef(null);

    return (
        <div>
            <h2 className="font-semibold text-gray-800 text-lg">Edit account info</h2>
            <Form method="post" className="max-w-2xl border border-red-500">
                <fieldset>
                    <div className="grid lg:grid-cols-2 gap-4 items-center">
                        <div>
                            <Label htmlFor='email' text='Email' />
                            <Input
                                ref={emailRef}
                                type='email'
                                name='email'
                                id='email'
                                // placeholder='Jane Doe'
                                defaultValue={user.email}
                                fieldError={actionData?.fieldErrors?.email}
                            />
                        </div>
                        <Link to="password" className="underline hover:text-blue-500">
                            Change password
                        </Link>
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-3 rounded"
                        name="_action"
                        value="email"
                    >
                        {isSubmitting && navigation.formData.get('_action') === "email" ? 'Saving...' : 'Save'}
                    </button>
                </fieldset>
            </Form>
            <div className="mt-4">
                <Outlet />
            </div>
        </div>
    );
}