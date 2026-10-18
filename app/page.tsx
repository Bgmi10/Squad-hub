import { prisma } from "@/lib/prisma";
import EventRow from "@/components/EventRow";
export const dynamic = "force-dynamic";

export default async function Home() {
  const [events, players] = await Promise.all([
    prisma.event.findMany({ where: { startsAt: { gte: new Date() } }, orderBy: { startsAt: "asc" }, take: 5 }),
    prisma.player.count(),
  ]);
  return (
    <>
      <h1 className="text-2xl font-bold">This week at the club</h1>
      <p className="text-slate-600">{players} players registered.</p>
      <ul className="space-y-3">
        {events.length ? events.map((e) => <EventRow key={e.id} e={e} />) : <p className="text-slate-500">Nothing scheduled yet.</p>}
      </ul>
    </>
  );
}
