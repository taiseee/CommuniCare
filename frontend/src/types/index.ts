import { Timestamp } from "@firebase/firestore-types";

export interface EventListItem {
    eventId: string;
    title: string;
    host: string;
    category: boolean;
    location: string;
    updatedAt: Timestamp;
    participantsNum: number;
}