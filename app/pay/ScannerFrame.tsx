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
    // Reverted back to white/paper styling for black background
    <button
      type="button"
      onClick={onClick}
      className="text-paper [--focus-ring:var(--color-paper)] flex w-24 flex-col items-center gap-2 text-center"
    >
      <span
        aria-hidden
        className="border-paper/25 flex h-14 w-14 items-center justify-center rounded-full border hover:bg-white/10 backdrop-blur-sm transition-colors"
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ref = code.trim().toUpperCase();
    if (ref) router.push(`/p/${ref}`);
  }

  return (
    <>
      {/* Full screen video background covering the whole phone */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`fixed inset-0 z-0 h-full w-full object-cover transition-opacity duration-300 ${
          cameraStatus === "active" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Center viewfinder area - holds z-10 stack to stay on top of video */}
      <div className="relative z-10 flex flex-1 items-center justify-center py-10">
        
        {/* Viewfinder box with giant box-shadow mask to dim the rest of the screen */}
        <div className="relative h-[17rem] w-[17rem] max-w-full rounded-[1.75rem] shadow-[0_0_0_100vmax_rgba(16,16,12,0.62)]">
          
          {/* Inner space messages for loading, denied, unsupported states */}
          {cameraStatus !== "active" && (
            <div className="absolute inset-0 bg-foreground/80 flex items-center justify-center text-center rounded-[1.75rem]">
              {cameraStatus === "loading" && (
                <span className="text-on-ink/60 text-[0.8125rem]">Accessing camera...</span>
              )}
              {cameraStatus === "denied" && (
                <span className="text-on-ink/60 px-4 text-[0.8125rem]">
                  Camera permission denied.<br />Enter code manually.
                </span>
              )}
              {cameraStatus === "unsupported" && (
                <span className="text-on-ink/60 px-4 text-[0.8125rem]">
                  Camera not supported.<br />Enter code manually.
                </span>
              )}
            </div>
          )}

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

      {/* Control row and labels layered on top of video */}
      <div className="relative z-10">
        <p className="text-on-ink text-center text-[0.9375rem] drop-shadow-sm font-medium">
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
      </div>

      <dialog
        ref={entry}
        aria-labelledby="entry-title"
        className="bg-card text-foreground m-auto w-[min(21.25rem,calc(100vw-2.5rem))] rounded-3xl p-6 text-center backdrop:bg-foreground/60 z-30"
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
