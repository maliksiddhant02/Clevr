import QRCode from "qrcode";

export async function QrCard({ url }: { url: string }) {
  let qrSvg = "";
  try {
    qrSvg = await QRCode.toString(url, {
      type: "svg",
      width: 220,
      margin: 0,
    });
  } catch {
    qrSvg = `<svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="220" rx="12" fill="#f0f0f0"/>
      <text x="110" y="115" text-anchor="middle" font-size="14" fill="#999">QR unavailable</text>
    </svg>`;
  }

  return (
    <div
      className="inline-block"
      dangerouslySetInnerHTML={{ __html: qrSvg }}
    />
  );
}
