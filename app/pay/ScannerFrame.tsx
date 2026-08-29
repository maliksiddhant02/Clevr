"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Image01Icon, KeyboardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { openMvp } from "@/components/Mvp";

// ponytail: no camera decode yet. The code dialog takes a ref and routes to
// /p/[ref]. Add a QR decoder (e.g. jsQR) when a real QR is printed.

/** One of the two round actions under the viewfinder. */
function Action({
  icon,
  label,
  onClick,
}: {
  icon: IconSvgElement;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-paper [--focus-ring:var(--color-paper)] flex w-24 flex-col items-center gap-2 text-center"
    >
      <span
        aria-hidden
        className="border-paper/25 flex h-14 w-14 items-center justify-center rounded-full border hover:bg-white/5 transition-colors"
      >
        <HugeiconsIcon icon={icon} size={22} strokeWidth={1.8} />
      </span>
      <span className="text-on-ink text-[0.8125rem] leading-none">{label}</span>
    </button>
  );
}

export function ScannerFrame() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const entry = useRef<HTMLDialogElement>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStatus, setCameraStatus] = useState<"loading" | "active" | "denied" | "unsupported">("loading");

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus("unsupported");
      return;
    }

    let activeStream: MediaStream | null = null;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        activeStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraStatus("active");
      } catch (err) {
        console.error("Camera access error:", err);
        setCameraStatus("denied");
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Update srcObject on videoRef if status becomes active later
  useEffect(() => {
    if (cameraStatus === "active" && videoRef.current && videoRef.current.srcObject === null) {
      // Re-query stream if needed, but normally handled in the initialization effect
    }
  }, [cameraStatus]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ref = code.trim().toUpperCase();
    if (ref) router.push(`/p/${ref}`);
  }

  return (
    <>
      {/* The viewfinder takes the free space rather than a fixed height, so it
          sits optically centred on a tall phone and a short one alike. */}
      <div className="flex flex-1 items-center justify-center py-10">
        <div className="relative h-[17rem] w-[17rem] max-w-full">
          
          {/* Camera feed viewport wrapper */}
          <div className="absolute inset-[3px] overflow-hidden rounded-[1.5rem] bg-black/40 flex items-center justify-center">
            {cameraStatus === "active" && (
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="h-full w-full object-cover"
              />
            )}
            {cameraStatus === "loading" && (
              <span className="text-on-ink/60 text-[0.8125rem]">Accessing camera...</span>
            )}
            {cameraStatus === "denied" && (
              <span className="text-on-ink/60 text-center px-4 text-[0.8125rem]">
                Camera permission denied.<br />Enter code manually.
              </span>
            )}
            {cameraStatus === "unsupported" && (
              <span className="text-on-ink/60 text-center px-4 text-[0.8125rem]">
                Camera not supported.<br />Enter code manually.
              </span>
            )}
          </div>

          {/* Four brackets overlay (Aim) */}
          <div className="qr-pulse absolute inset-0 pointer-events-none">
            {(
              [
                ["top-0 left-0", "border-t-[3px] border-l-[3px] rounded-tl-[1.75rem]"],
                ["top-0 right-0", "border-t-[3px] border-r-[3px] rounded-tr-[1.75rem]"],
                ["bottom-0 left-0", "border-b-[3px] border-l-[3px] rounded-bl-[1.75rem]"],
                ["bottom-0 right-0", "border-b-[3px] border-r-[3px] rounded-br-[1.75rem]"],
              ] as const
            ).map(([corner, edges]) => (
              <span
                key={corner}
                aria-hidden
                className={`border-sun absolute h-16 w-16 ${corner} ${edges}`}
              />
            ))}
          </div>

        </div>
      </div>

      <p className="text-on-ink text-center text-[0.9375rem]">
        Scan a code, or enter one manually below.
      </p>

      <div className="mt-8 flex justify-center gap-6">
        <Action icon={Image01Icon} label="Upload QR" onClick={openMvp} />
        <Action
          icon={KeyboardIcon}
          label="Enter code"
          onClick={() => entry.current?.showModal()}
        />
      </div>

      <dialog
        ref={entry}
        aria-labelledby="entry-title"
        className="bg-card text-foreground m-auto w-[min(21.25rem,calc(100vw-2.5rem))] rounded-3xl p-6 text-center backdrop:bg-foreground/60"
      >
        <h2 id="entry-title" className="display text-[1.5rem]">
          Enter the code
        </h2>
        <p className="text-muted-foreground mt-3 text-[0.9375rem] leading-relaxed">
          It is printed under the shop&apos;s QR.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
            autoCapitalize="characters"
            autoComplete="off"
            placeholder="CLVR7K2QX"
            aria-label="Payment reference code"
            className="border-muted-foreground text-foreground placeholder:text-muted-foreground focus:border-foreground h-14 w-full rounded-full border bg-transparent px-5 text-center font-mono text-[1rem] uppercase placeholder:normal-case"
          />
          <button
            type="submit"
            disabled={!code.trim()}
            className="bg-foreground text-paper [--focus-ring:var(--color-paper)] [--focus-ring-offset:-5px] flex h-14 w-full items-center justify-center rounded-full text-[1.0625rem] font-semibold disabled:opacity-40"
          >
            Go
          </button>
        </form>

        <form method="dialog">
          <button
            type="submit"
            className="text-muted-foreground mt-1 h-12 w-full text-[1.0625rem] font-semibold"
          >
            Cancel
          </button>
        </form>
      </dialog>
    </>
  );
}
