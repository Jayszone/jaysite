import { PhoneFrame, PhoneScreen } from "./Phone";
import { video } from "@/lib/sd/data";

// The opening visual: the same app on two phones. Left: a Personal feed of familiar interests.
// Right: Shared Discovery with subjects a private circle has been exploring.
const PERSONAL = ["aircAruvnKk", "0OyhASRR0To", "EK32jo7i5LQ"].map(video);
const SHARED = ["gFP-7Z9HLww", "_IOPlGPQPuM", "uIIcEDzYsA4", "2W85Dwxx218"].map(video);

export default function HeroPhones() {
  return (
    <div className="ph-pair sd-wide">
      <figure className="ph-fig sd-rise" style={{ ["--i" as string]: 4 }}>
        <PhoneFrame label="A phone showing a Personal Home feed: AI, computer science and mathematics videos.">
          <PhoneScreen shared={false} chips={["Artificial intelligence", "Computer science", "Mathematics", "Technology"]} videos={PERSONAL} />
        </PhoneFrame>
        <figcaption>Personal</figcaption>
      </figure>
      <figure className="ph-fig is-b sd-rise" style={{ ["--i" as string]: 6 }}>
        <PhoneFrame label="The same app in Shared Discovery: ancient civilizations, Renaissance architecture, nuclear energy and psychology videos from a private circle.">
          <PhoneScreen shared circle="The Rabbit Hole" chips={["Ancient civilizations", "Architecture", "Nuclear energy", "Psychology", "Science", "Nature"]} videos={SHARED} />
        </PhoneFrame>
        <figcaption>Shared Discovery</figcaption>
      </figure>
    </div>
  );
}
