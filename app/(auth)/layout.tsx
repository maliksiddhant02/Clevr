// Auth shell — no tab bar. Landing-style: Sun ground edge to edge.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 flex-col">{children}</div>;
}
