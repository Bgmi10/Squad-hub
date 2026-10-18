"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EventType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const str = (f: FormData, k: string) => (f.get(k)?.toString().trim() || null);
const int = (f: FormData, k: string) => { const v = str(f, k); return v ? parseInt(v, 10) : null; };

export async function createPlayer(f: FormData) {
  await prisma.player.create({
    data: {
      name: str(f, "name")!, position: str(f, "position")!, number: int(f, "number"),
      phone: str(f, "phone"), email: str(f, "email"),
      photoUrl: str(f, "photoUrl"), medicalNotes: str(f, "medicalNotes"),
    },
  });
  revalidatePath("/players");
}

export async function deletePlayer(f: FormData) {
  await prisma.player.delete({ where: { id: f.get("id") as string } });
  revalidatePath("/players");
  redirect("/players");
}

export async function createEvent(f: FormData) {
  await prisma.event.create({
    data: {
      title: str(f, "title")!, type: f.get("type") as EventType,
      startsAt: new Date(str(f, "startsAt")!), location: str(f, "location"),
      notes: str(f, "notes"), remindMinutes: int(f, "remindMinutes") ?? 60,
    },
  });
  revalidatePath("/calendar"); revalidatePath("/");
}

export async function deleteEvent(f: FormData) {
  await prisma.event.delete({ where: { id: f.get("id") as string } });
  revalidatePath("/calendar"); revalidatePath("/");
}

export async function logStat(f: FormData) {
  const playerId = str(f, "playerId")!, eventId = str(f, "eventId")!;
  const data = {
    minutes: int(f, "minutes") ?? 0, goals: int(f, "goals") ?? 0, assists: int(f, "assists") ?? 0,
    rating: str(f, "rating") ? parseFloat(str(f, "rating")!) : null,
  };
  await prisma.stat.upsert({
    where: { playerId_eventId: { playerId, eventId } },
    create: { playerId, eventId, ...data }, update: data,
  });
  revalidatePath("/stats");
}
