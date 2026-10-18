import { prisma } from "@/lib/prisma";
import { logStat } from "@/app/actions";
export const metadata = { title: "Stats" };
export const dynamic = "force-dynamic";

export default async function Stats() {
  const [players, events] = await Promise.all([
    prisma.player.findMany({ orderBy: { name: "asc" }, include: { stats: { include: { event: true }, orderBy: { event: { startsAt: "asc" } } } } }),
    prisma.event.findMany({ where: { type: { in: ["MATCH", "TRAINING"] } }, orderBy: { startsAt: "desc" }, take: 30 }),
  ]);
  const rows = players.map((p) => {
    const rated = p.stats.filter((s) => s.rating != null);
    return {
      id: p.id, name: p.name, apps: p.stats.length,
      goals: p.stats.reduce((a, s) => a + s.goals, 0), assists: p.stats.reduce((a, s) => a + s.assists, 0),
      avg: rated.length ? rated.reduce((a, s) => a + s.rating!, 0) / rated.length : null,
      trend: rated.slice(-5).map((s) => s.rating!),
    };
  });
  return (
    <>
      <h1 className="text-2xl font-bold">Stats &amp; trends</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="text-slate-500"><th>Player</th><th>Apps</th><th>Goals</th><th>Assists</th><th>Avg rating</th><th>Last 5</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id} className="border-t"><td className="py-1 font-medium">{r.name}</td><td>{r.apps}</td><td>{r.goals}</td><td>{r.assists}</td>
              <td>{r.avg?.toFixed(1) ?? "–"}</td>
              <td><div className="flex h-6 items-end gap-0.5">{r.trend.map((v, i) => (
                <span key={i} title={String(v)} className="w-2 rounded-sm bg-pitch-600" style={{ height: `${(v / 10) * 100}%` }} />))}</div></td></tr>))}</tbody>
        </table>
      </div>
      <form action={logStat} className="card grid gap-3 sm:grid-cols-3">
        <h2 className="font-semibold sm:col-span-3">Log stats (re-submitting updates the entry)</h2>
        <select name="playerId" required className="input">{players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <select name="eventId" required className="input sm:col-span-2">{events.map((e) => (
          <option key={e.id} value={e.id}>{e.startsAt.toLocaleDateString("en-GB")} – {e.title}</option>))}</select>
        <input name="minutes" type="number" placeholder="Minutes" className="input" />
        <input name="goals" type="number" placeholder="Goals" className="input" />
        <input name="assists" type="number" placeholder="Assists" className="input" />
        <input name="rating" type="number" step="0.1" min="1" max="10" placeholder="Rating (1-10)" className="input sm:col-span-3" />
        <button className="btn sm:col-span-3">Save</button>
      </form>
    </>
  );
}
