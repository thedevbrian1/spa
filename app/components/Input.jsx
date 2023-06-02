import { useTransition } from "@remix-run/react";
import { forwardRef, useEffect, useState } from "react";

const Input = forwardRef(({ type, name, id, placeholder, fieldError, defaultValue, formError }, ref) => {
    // const actionData = useActionData();
    const [isClientError, setIsClientError] = useState(true);
    const errorState = isClientError && fieldError;
    // const inputRef = useRef(null);
    const transition = useTransition();

    function handleChange() {
        setIsClientError(false);
    }

    // useEffect(() => {
    //     if (transition.submission) {
    //         setIsClientError(true);
    //     }
    // }, [transition]);
    // TODO: Fix the flash of error message upon submission
    return (
        <>
            {type === 'textarea'
                ? (<textarea
                    ref={ref}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border bg-gray-100 rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-a11y-2 ${errorState ? 'border-red-700' : 'border-gray-400'}`}
                />)
                : (<input
                    ref={ref}
                    type={type}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    // onChange={handleChange}
                    // onBlur={handleBlur}
                    // onBlur={onBlur}
                    className={`block w-full px-3 py-2 border bg-gray-100 rounded border-gray-300 text-light-black  focus:border-none focus:outline-none focus:ring-2 focus:ring-a11y-2 ${errorState
                        ? 'border-red-700'
                        : type === 'password' && formError
                            ? 'border-red-700'
                            : 'border-gray-400'
                        }`}
                />)
            }

            {
                errorState
                    ? (<span className="pt-1 text-red-700 inline text-sm" id="email-error">
                        {fieldError}
                    </span>)
                    : <>&nbsp;</>
            }
        </>

    );
})

export default Input;