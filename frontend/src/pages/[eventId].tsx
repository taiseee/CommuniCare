import { useRouter } from "next/router";

export default function EventDetail() {
    const router = useRouter();
    const { eventId } = router.query;
    return (
        <>
            eventId: {eventId}
        </>
    );
}