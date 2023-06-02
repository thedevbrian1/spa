import { Form, useActionData, useLocation, useNavigation } from "@remix-run/react"
import { useEffect, useRef, useState } from "react";
import Label from "../components/Label";
import Input from "../components/Input";
import { badRequest, trimPhone, validatePhone } from "../utils";

// export async function loader() {

//     return null;
// }

export async function action({ request }) {
    const formData = await request.formData();
    const payment = formData.get('payment');

    let fieldErrors = {};

    switch (payment) {
        case "mpesa":

            console.log("mpesa from action!!");
            console.log({ phone });
            const phone = formData.get('phone');

            const trimmedPhone = trimPhone(phone);
            fieldErrors.phone = validatePhone(trimmedPhone);

            if (Object.values(fieldErrors).some(Boolean)) {
                return badRequest({ fieldErrors });
            }
            // MPESA payment integration
            // TODO: Send money to specific no

            break;
        case "visa":
            console.log("visa from action!!");
            break;
        case "mastercard":
            console.log("mastercard from action!!");
            break;
        default:
            break;
    }
    return null;
}

export default function Book() {
    const { state } = useLocation();
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    const [paymentMethod, setPaymentMethod] = useState(null);

    const phoneRef = useRef(null);
    const cardRef = useRef(null);

    const cards = ["visa", "mastercard"];


    console.log({ paymentMethod });

    return (
        <main className="pt-24 lg:pt-36 w-4/5 xl:max-w-6xl mx-auto">

            <h1 className="text-2xl">Book {'Girl'}</h1>
            <p className="font-semibold text-lg">Ksh {'5000'}</p>
            <p>Please choose your preferred payment method:</p>
            <Form >
                <fieldset className="flex gap-x-3" onChange={(e) => setPaymentMethod(e.target.value)}>
                    <div>
                        <input type="radio" name="payment" id="mpesa" value="mpesa" />
                        <label htmlFor="mpesa" className="ml-1">MPESA</label>
                    </div>
                    <div>
                        <input type="radio" name="payment" id="visa" value="visa" />
                        <label htmlFor="visa" className="ml-1">VISA</label>
                    </div>
                    <div>
                        <input type="radio" name="payment" id="mastercard" value="mastercard" />
                        <label htmlFor="mastercard" className="ml-1">Mastercard</label>
                    </div>
                </fieldset>
                {
                    paymentMethod === "mpesa"
                        ? (
                            <div>
                                <Label htmlFor="phone" text="Phone" />
                                <Input
                                    ref={phoneRef}
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    placeholder="0712 345 678"
                                    fieldError={actionData?.fieldErrors.phone}
                                />
                            </div>
                        )
                        : cards.includes(paymentMethod)
                            ? (
                                <div>
                                    <Label htmlFor="card" text="Card" />
                                    <Input
                                        ref={cardRef}
                                        type="text"
                                        name="card"
                                        id="card"
                                        fieldError={actionData?.fieldErrors.card}
                                    />
                                </div>
                            )
                            : null
                }
                {
                    paymentMethod === "mpesa" || paymentMethod === "mastercard" || paymentMethod === "visa"
                        ? (
                            <button type="submit" className="bg-brand-red px-6 py-2 text-center text-white rounded">
                                {isSubmitting ? 'Processing...' : 'Submit'}
                            </button>
                        )
                        : null
                }


            </Form>

        </main>
    );
}