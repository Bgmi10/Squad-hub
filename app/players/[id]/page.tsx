import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deletePlayer } from "@/app/actions";
export const dynamic = "force-dynamic";

export default async function PlayerPage({ params }: { params: { id: string } }) {
  const p = await prisma.player.findUnique({
    where: { id: params.id },
    include: { stats: { include: { event: true }, orderBy: { event: { startsAt: "desc" } } } },
  });
  if (!p) notFound();
  return (
    <>
      <div className="card flex flex-col gap-4 sm:flex-row">
        {p.photoUrl ? <img src={p.photoUrl} alt={p.name} className="h-32 w-32 rounded-xl object-cover" /> :
          <div className="h-32 w-32 rounded-xl bg-slate-200" />}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{p.number ? `#${p.number} ` : ""}{p.name}</h1>
          <p className="text-slate-600">{p.position}</p>
          {p.phone && <p><a className="text-pitch-600" href={`tel:${p.phone}`}>{p.phone}</a></p>}
          {p.email && <p><a className="text-pitch-600" href={`mailto:${p.email}`}>{p.email}</a></p>}
          <p className="pt-2 text-sm"><b>Medical:</b> {p.medicalNotes || "None recorded"}</p>
        </div>
      </div>
      <div className="card overflow-x-auto">
        <h2 className="mb-2 font-semibold">Match &amp; training log</h2>
        <table className="w-full text-left text-sm">
          <thead><tr className="text-slate-500"><th>Date</th><th>Event</th><th>Min</th><th>G</th><th>A</th><th>Rating</th></tr></thead>
          <tbody>{p.stats.map((s) => (
            <tr key={s.id} className="border-t"><td>{s.event.startsAt.toLocaleDateString("en-GB")}</td><td>{s.event.title}</td>
              <td>{s.minutes}</td><td>{s.goals}</td><td>{s.assists}</td><td>{s.rating ?? "–"}</td></tr>))}</tbody>
        </table>
      </div>
      <form action={deletePlayer}><input type="hidden" name="id" value={p.id} />
        <button className="text-sm text-red-600 hover:underline">Remove player</button></form>
    </>
  );
}
