import { useState } from 'react';
import ParticipationButton from '@/components/ParticipationButton';
import ParticipantList from './ParticipantList';
import { Event } from './EventContainer';

interface props {
    event: Event;
}

export function ParticipationContainer({ event }: props): JSX.Element {
    const [status, setStatus] = useState<number>(2);
    return (
        <>
            <ParticipantList eventId={event.id} status={status} />
            <ParticipationButton
                eventId={event.id}
                status={status}
                setStatus={setStatus}
            />
        </>
    );
}
