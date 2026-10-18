import { Event } from "@prisma/client";
import { deleteEvent } from "@/app/actions";

const badge = { TRAINING: "bg-blue-100 text-blue-800", MATCH: "bg-green-100 text-green-800", CLUB: "bg-amber-100 text-amber-800" };

export default function EventRow({ e, canDelete }: { e: Event; canDelete?: boolean }) {
  return (
    <li className="card flex items-center justify-between gap-3">
      <div>
        <span className={`mr-2 rounded px-2 py-0.5 text-xs font-medium ${badge[e.type]}`}>{e.type}</span>
        <span className="font-medium">{e.title}</span>
        <p className="text-sm text-slate-500">
          {e.startsAt.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
          {e.location && ` · ${e.location}`} · reminder {e.remindMinutes}m before
        </p>
        {e.notes && <p className="text-sm">{e.notes}</p>}
      </div>
      {canDelete && (
        <form action={deleteEvent}><input type="hidden" name="id" value={e.id} />
          <button className="text-sm text-red-600 hover:underline">Delete</button></form>
      )}
    </li>
  );
}
