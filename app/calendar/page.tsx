import { prisma } from "@/lib/prisma";
import { createEvent } from "@/app/actions";
import EventRow from "@/components/EventRow";
export const metadata = { title: "Calendar" };
export const dynamic = "force-dynamic";

export default async function Calendar() {
  const events = await prisma.event.findMany({ where: { startsAt: { gte: new Date(Date.now() - 864e5) } }, orderBy: { startsAt: "asc" } });
  return (
    <>
      <h1 className="text-2xl font-bold">Calendar</h1>
      <ul className="space-y-3">{events.map((e) => <EventRow key={e.id} e={e} canDelete />)}</ul>
      <form action={createEvent} className="card grid gap-3 sm:grid-cols-2">
        <h2 className="font-semibold sm:col-span-2">Add event</h2>
        <input name="title" required placeholder="Title (e.g. vs Rovers)" className="input" />
        <select name="type" className="input"><option>TRAINING</option><option>MATCH</option><option>CLUB</option></select>
        <input name="startsAt" type="datetime-local" required className="input" />
        <input name="location" placeholder="Location" className="input" />
        <input name="remindMinutes" type="number" defaultValue={60} className="input" aria-label="Reminder minutes before" />
        <input name="notes" placeholder="Notes" className="input" />
        <button className="btn sm:col-span-2">Save event</button>
      </form>
    </>
  );
}
