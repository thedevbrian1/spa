import { useFetcher } from "@remix-run/react"
import { TrashIcon } from "./Icon";

export default function DeletableImage({ url, id }) {
    const fetcher = useFetcher();
    const isSubmitting = fetcher.state !== 'idle';

    return (
        <div className={`relative max-w-xs aspect-square  ${isSubmitting ? 'opacity-0' : ''}`}>
            <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
            />
            <fetcher.Form method="post" className="absolute top-0 right-2">
                {/* <input type="checkbox" name="" id="" /> */}
                <input type="hidden" name="imageId" value={id} />
                <input type="hidden" name="url" value={url} />
                <button type='submit' className="text-red-500 hover:text-red-700">
                    <TrashIcon />
                </button>
            </fetcher.Form>
        </div>
    );
}