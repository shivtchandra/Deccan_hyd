import ReelPlayer from "../components/reel/ReelPlayer.jsx";

export const metadata = {
  title: "Deccan Heritage Map — Cinematic Reel (Video-Shotcraft)",
  description: "A 30-second 9:16 motion-design promotional reel showcasing 400 years of Hyderabad heritage, 85 curated sites, and the Charminar mystery.",
};

export default function ReelPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#120E0B",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ReelPlayer />
    </main>
  );
}
