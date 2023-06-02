import { Link, useLoaderData } from "@remix-run/react";
import { ToastContainer, toast } from "react-toastify";
import toastStyles from "react-toastify/dist/ReactToastify.css";
import { useOptionalUser } from "~/utils";
import GirlCard from "../components/GirlCard";
import { ArrowRight } from "../components/Icon";
import { getSession, sessionStorage } from "../session.server";
import { useEffect, useRef } from "react";

export const meta = () => [{ title: "Spa" }];

export function links() {
  return [
      {
          rel: "stylesheet",
          href: toastStyles
      }
  ];
}

export async function loader({request}) {
  const session = await getSession(request);
  const successStatus = session.get('success');
  return json({successStatus}, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session)
    }
  });
}

export default function Index() {
  const user = useOptionalUser();
  const data = useLoaderData();

  const toastId = useRef(null);

  function success() {
    toastId.current = toast.success('Password reset successful! Log in with new password', {
        position: toast.POSITION.BOTTOM_RIGHT
    });
}

useEffect(() => {
  if (data.successStatus === true) {
    success();
  }
  return () => {
    toast.dismiss(toastId.current);
  }
}, [data]);

  return (
    <main>
      <Hero />
      <AvailableGirls />

    <ToastContainer />
    </main>
  );
}

function Hero() {
  return (
    <section className="h-screen bg-[url('/girl.jpg')] bg-black bg-opacity-50 bg-blend-overlay bg-center bg-no-repeat bg-cover">
      <div className="w-full h-full flex justify-center items-center">
        <div>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl text-center font-semibold">Looking for a good time?</h1>
          <div className="w-full flex justify-center mt-8">
            <Link to={`/girls`} className="bg-brand-red px-6 py-3 text-white text-center rounded">
              View our catalogue
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}

function AvailableGirls() {
  return (
    <section className="w-4/5 mx-auto xl:max-w-6xl mt-16 lg:mt-20">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center">All sizes, All complexion</h2>
      <p className="text-gray-800 mt-4 text-center text-lg">We have a variety of girls to choose from</p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:max-w-4xl mx-auto border border-red-500">
        {/* TODO: Fix landscape orientation */}
        <GirlCard src='girl2.jpg' />
        <GirlCard src='girl.jpg' />
        <GirlCard src='girl2.jpg' />
        <GirlCard src='girl2.jpg' />
        <GirlCard src='girl.jpg' />
      </div>
      <div className="flex justify-center mt-4">
        <Link to="/girls" className="flex gap-x-2 underline hover:text-blue-500 transition ease-in-out duration-300">
          View all girls <ArrowRight />
        </Link>
      </div>
    </section>
  );
}
