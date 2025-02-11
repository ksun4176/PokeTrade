import { players } from "@prisma/client";

export type UserDetails = {
  username: string;
  discordId: string;
}

export type SerializerDone = (error: Error | null, user: players | null) => void;