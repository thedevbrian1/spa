import { Link, useMatches } from "@remix-run/react";
import { EditIcon } from "../components/Icon";

export default function ProfileIndex() {
    const matches = useMatches();
    console.log({ matches });
    const { user } = matches[1].data;
    console.log({ user });
    return (
        <div>
            <h2 className="font-semibold text-gray-800 text-lg">My Profile</h2>
            {/* TODO: Show no of clients gotten through the site 
                      Show amount earned through the site
            */}

            <div className="flex justify-between items-center border border-slate-100 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-x-4">
                    {/* TODO: Add profile pic url */}
                    <div className="w-20 h-20">
                        <img src="/girl.jpg" alt="" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div>
                        <p className="text-lg">{user.girl.name}</p>
                        {/* <p className="text-gray-500">Location</p> */}
                    </div>
                </div>
                <span className="border border-gray-100 rounded text-gray-500 h-fit py-2 px-3">Edit</span>
            </div>

            <div className="border border-slate-100 rounded-lg p-4 mt-8">
                <h3 className="font-semibold">Personal information</h3>
                <div className="flex justify-between pt-4">
                    <div className="grid grid-cols-2 gap-4 border border-gray-100 xl:w-[600px]">
                        <div>
                            <Subtitle title='Name' />
                            <p className="mt-1">{user.girl.name}</p>
                        </div>
                        <div>
                            <Subtitle title='Phone' />
                            <p className="mt-1">{user.girl.phone}</p>
                        </div>
                    </div>
                    <Link
                        to="edit"
                        className="flex gap-x-2 border border-gray-100 rounded text-gray-500 h-fit py-2 px-3"
                        prefetch="intent"
                    >
                        Edit <EditIcon />
                    </Link>
                </div>
            </div>

            <div className="border border-slate-100 mt-8 p-4">
                <h3 className="font-semibold">Account information</h3>
                <div className="flex justify-between pt-4">
                    <div className="grid grid-cols-2 gap-4  xl:w-[600px]">
                        <div>
                            <Subtitle title='Email address' />
                            <p className="mt-1">{user.email}</p>
                        </div>
                        <div>
                            <Subtitle title='Password' />
                            <p className="mt-1">******</p>
                        </div>
                    </div>
                    <Link
                        to="account"
                        className="flex gap-x-2 border border-gray-100 rounded text-gray-500 h-fit py-2 px-3"
                        prefetch="intent"
                    >
                        Edit <EditIcon />
                    </Link>
                </div>
            </div>
        </div>
    );
}

function Subtitle({ title }) {
    return (
        <p className="text-gray-500">{title}</p>
    );
}