import { cssBundleHref } from "@remix-run/css-bundle";

import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";
import Nav from "./components/Nav";
import { useState } from "react";

export const links = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }) => {
  return json({ user: await getUser(request) });
};

export default function App() {
  const { user } = useLoaderData();
  const [hash, setHash] = useState();

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        {!user ?
          <header className="absolute top-4 w-full flex items-center justify-between px-8">
            <Link to="/">
              <div className="w-40 h-14 lg:w-64 lg:h-20">
                {/* <img src="/logo.png" className="w-full h-full" /> */}
                <p className="font-semibold text-3xl">LOGO</p>
              </div>
            </Link>
            <Nav hash={hash} setHash={setHash} />
          </header>
          : null
        }
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
