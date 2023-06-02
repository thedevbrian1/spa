import { Form, Link, NavLink, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import SideNavMenuItem from "../components/SideNavMenuItem";
import { requireUser } from "../session.server";
import { json } from "@remix-run/node";
import { CogIcon, EditIcon, PhotoIcon, UserIcon } from "../components/Icon";

const dashboardMenuItems = [
    {
        text: 'My profile',
        href: '/profile',
        icon: <UserIcon />
    },
    {
        text: 'Photos',
        href: 'photos',
        icon: <PhotoIcon />
    },
    {
        text: 'Edit profile',
        href: 'edit',
        icon: <EditIcon />
    },
    {
        text: 'Account settings',
        href: 'account',
        icon: <CogIcon />
    }
];

export async function loader({ request }) {
    const user = await requireUser(request);
    // console.log({ user });
    return json({ user });
}

export default function Profile() {
    const { user } = useLoaderData();
    const navigation = useNavigation();

    const isLoading = navigation.state === 'loading';

    return (
        <div className="w-full min-h-screen flex flex-col">
            <header className="flex items-center justify-end bg-pink-500 p-4 text-white">
                {/* <h1 className="text-3xl font-bold">
                    <Link to=".">Spa</Link>
                </h1> */}
                {/* <p>{user.email}</p> */}
                <div className="flex items-center gap-x-4">
                    <span>Hello {user.girl.name}</span>
                    <Form action="/logout" method="post">
                        <button
                            type="submit"
                            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
                        >
                            Logout
                        </button>
                    </Form>
                </div>
            </header>
            <main className="min-h-screen flex divide-x">
                <div className="h-full fixed top-0 left-0 w-80 border-r bg-gray-50">
                    <div className="border border-red-500 bg-pink-500 py-[17px]">
                        <h1 className="text-3xl text-white font-bold ml-4">
                            <Link to=".">Spa</Link>
                        </h1>
                    </div>
                    <ul className="divide-solid divide-y border-t">
                        {dashboardMenuItems.map((item, index) => (
                            <SideNavMenuItem key={index} href={item.href} text={item.text} icon={item.icon} />
                        ))}
                    </ul>

                </div>
                <div className={`flex-1 p-6 ml-80 ${isLoading ? 'opacity-50' : ''}`}>
                    <Outlet />
                </div>
            </main>


        </div>
    );
}