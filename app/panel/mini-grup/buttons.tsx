"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { leaveWaitlist, respondInvite, type MgResult } from "@/app/panel/mini-grup/actions";

function Msg({ r }: { r: MgResult | null }) {
  if (!r) return null;
  return (
    <p role={r.ok ? "status" : "alert"} className={`m-0 rounded-md px-4 py-3 text-[15px] ${r.ok ? "bg-primary-soft text-primary" : "bg-[#fdecea] text-destructive"}`}>
      {r.ok ? r.message : r.error}
    </p>
  );
}

export function InviteButtons({ memberId }: { memberId: string }) {
  const [r, setR] = useState<MgResult | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const go = (accept: boolean) =>
    start(async () => {
      const x = await respondInvite(memberId, accept);
      setR(x);
      if (x.ok) router.refresh();
    });
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={pending} onClick={() => go(true)} className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60">
          Gruba katılıyorum
        </button>
        <button type="button" disabled={pending} onClick={() => go(false)} className="rounded-md border border-border px-5 py-3 font-semibold hover:bg-primary-soft disabled:opacity-60">
          Bu grup uymuyor
        </button>
      </div>
      <Msg r={r} />
    </div>
  );
}

export function LeaveButton({ id }: { id: string }) {
  const [r, setR] = useState<MgResult | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const x = await leaveWaitlist(id);
            setR(x);
            if (x.ok) router.refresh();
          })
        }
        className="self-start text-[15px] font-semibold text-muted hover:text-destructive hover:underline"
      >
        Listeden çık
      </button>
      <Msg r={r} />
    </div>
  );
}
