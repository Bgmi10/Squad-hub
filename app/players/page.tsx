import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createPlayer } from "@/app/actions";
import PhotoUpload from "@/components/PhotoUpload";
export const metadata = { title: "Roster" };
export const dynamic = "force-dynamic";

export default async function Players() {
  const players = await prisma.player.findMany({ orderBy: { name: "asc" } });
  return (
    <>
      <h1 className="text-2xl font-bold">Roster</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {players.map((p) => (
          <Link key={p.id} href={`/players/${p.id}`} className="card text-center hover:border-pitch-600">
            {p.photoUrl ? <img src={p.photoUrl} alt={p.name} className="mx-auto h-20 w-20 rounded-full object-cover" /> :
              <div className="mx-auto h-20 w-20 rounded-full bg-slate-200" />}
            <p className="mt-2 font-medium">{p.number ? `#${p.number} ` : ""}{p.name}</p>
            <p className="text-sm text-slate-500">{p.position}</p>
          </Link>
        ))}
      </div>
      <form action={createPlayer} className="card grid gap-3 sm:grid-cols-2">
        <h2 className="font-semibold sm:col-span-2">Add player</h2>
        <div className="sm:col-span-2"><PhotoUpload /></div>
        <input name="name" required placeholder="Full name" className="input" />
        <input name="position" required placeholder="Position (e.g. CM)" className="input" />
        <input name="number" type="number" placeholder="Shirt number" className="input" />
        <input name="phone" placeholder="Phone" className="input" />
        <input name="email" type="email" placeholder="Email" className="input sm:col-span-2" />
        <textarea name="medicalNotes" placeholder="Medical notes (allergies, injuries…)" className="input sm:col-span-2" />
        <button className="btn sm:col-span-2">Save player</button>
      </form>
    </>
  );
}
