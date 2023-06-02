import { Form, Link, isRouteErrorResponse, useActionData, useLocation, useNavigation, useRouteError } from "@remix-run/react";
import Label from "../components/Label";
import Input from "../components/Input";
import { updatePassword, verifyLogin } from "../models/user.server";
import { getSession, getUser, logout } from "../session.server";
import { badRequest, validatePassword } from "../utils";

// export async function loader() {
//     throw new Response('Error', { status: 400 });
// }

export async function action({ request }) {
    const formData = await request.formData();
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    const fieldErrors = {
        currentPassword: validatePassword(currentPassword),
        newPassword: validatePassword(newPassword),
        confirmPassword: validatePassword(confirmPassword)
    };

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors });
    }

    const user = await getUser(request);
    const userEmail = user.email;

    const result = await verifyLogin(userEmail, currentPassword);

    if (!result) {
        return badRequest({ fieldErrors: { currentPassword: 'Incorrect password' } });
    } else if (newPassword !== confirmPassword) {
        return badRequest({ formError: 'Passwords do not match' });
    }

    await updatePassword(userEmail, newPassword);

    const session = await getSession(request);
    session.flash("success", true);

    return await logout(request);

}

// TODO: Notify user of successful password change with a toast

export default function Password() {
    const actionData = useActionData();

    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    return (
        <div>
            <Form method="post" className="max-w-2xl border border-red-500">
                <fieldset>
                    <div className="grid lg:grid-cols-2 gap-4 items-center">
                        <div>
                            <Label htmlFor='currentPassword' text='Current Password' />
                            <Input
                                // ref={passwordRef}
                                type="password"
                                name="currentPassword"
                                id="currentPassword"
                                fieldError={actionData?.fieldErrors?.currentPassword}
                            // formError={actionData?.formError}
                            />
                        </div>
                        <div>
                            <Label htmlFor='newPassword' text='New Password' />
                            <Input
                                // ref={passwordRef}
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                fieldError={actionData?.fieldErrors?.newPassword}
                                formError={actionData?.formError}
                            />
                        </div>
                        <div>
                            <Label htmlFor='confirmPassword' text='Confirm New Password' />
                            <Input
                                // ref={passwordRef}
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                fieldError={actionData?.fieldErrors?.confirmPassword}
                                formError={actionData?.formError}
                            />
                        </div>
                    </div>
                    {actionData?.formError
                        ? (<p className="text-red-500">{actionData?.formError}</p>)
                        : <>&nbsp;</>
                    }
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-3 rounded"
                        name="_action"
                        value="password"
                    >
                        {isSubmitting && navigation.formData.get('_action') === 'password' ? 'Saving...' : 'Save'}
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
            <div>
                <h1>{error.status} {error.statusText}</h1>
                {/* <p>{error.data}</p> */}
                <Link to="../" className="underline">
                    Try again
                </Link>
            </div>
        );
    } else if (error instanceof Error) {
        console.log({ error: error.message });
        console.log({ stackTrace: error.stack });
        return (
            <div>
                <h1>Error</h1>
                {/* <p>{error.message}</p> */}
                <Link to="../" className="underline">
                    Try again
                </Link>
            </div>
        );
    } else return <h1>Unknown error</h1>
}