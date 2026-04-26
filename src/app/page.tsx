import GlobeComponent from "@/src/components/Globe/Globe";
import { generateMockValidators } from "@/src/lib/validators";

export default function Home() {
  const initialValidators = generateMockValidators();

  return (
    <main className="w-full h-screen">
      <GlobeComponent initialValidators={initialValidators} />
      
    </main>
  );
}