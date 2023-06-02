import { json } from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(to, defaultRedirect = DEFAULT_REDIRECT) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(id) {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user) {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser() {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser() {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

// export function validateEmail(email) {
//   return typeof email === "string" && email.length > 3 && email.includes("@");
// }

export function validateEmail(email) {
  if (typeof email !== "string" || !email || email.length < 3 || !email.includes("@")) {
    return 'Email is invalid';
  }
}

export function validateImageSrc(imageSrc) {
  if (!imageSrc) {
    return 'Something went wrong';
  }
}

export function trimPhone(phone) {
  return phone.replace(/\D+/g, '');
}

export function validatePhone(phone) {
  // if (typeof phone !== "string" || phone.length < 10) {
  //   return 'Phone number is invalid';
  // }
  const safariomRegex = /^(?:254|\+254|0)?([71](?:(?:0[0-8])|(?:[12][0-9])|(?:9[0-9])|(?:4[0-3])|(?:4[68]))[0-9]{6})$/;

  const airtelRegex = /^(?:254|\+254|0)?(7(?:(?:3[0-9])|(?:5[0-6])|(?:8[0-2])|(?:8[6-9]))[0-9]{6})$/;

  const telkomRegex = /^(?:254|\+254|0)?(77[0-9][0-9]{6})$/;

  if (typeof phone !== "string" || phone.length < 10) {
    return 'Phone number is invalid';
  }

  else if (!phone.match(safariomRegex) && !phone.match(airtelRegex) && !phone.match(telkomRegex)) {
    return 'Phone number is invalid';
  }
}

export function validateName(name) {
  if (!name) {
    return 'Name cannot be empty';
  } else if (typeof name !== "string") {
    return 'Name must be a string';
  } else if (name.length < 2) {
    return 'Name must be at least two characters long';
  }
}

export function validatePassword(password) {
  if (typeof password !== "string" || password.length === 0) {
    return 'Password is required';
  } else if (password.length < 8) {
    return 'Password must contain at least 8 characters';
  }
}


export function badRequest(data) {
  return json(data, { status: 404 });
}

export function getCloudinaryPublicId(imageUrl) {
  const regex = /remix\/([a-zA-Z0-9]+)/;
  const match = imageUrl.match(regex);
  const publicId = match ? match[0] : '';
  return publicId;
}
