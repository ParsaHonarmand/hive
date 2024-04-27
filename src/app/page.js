import { Dropdown } from "./components/dropdown";
import ages from "./data/ages";
import names from "./data/names";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Couple of test cases setup. One with strings and one with numbers */}
      {/* <Dropdown label="age" mode="single" options={ages} /> */}
      <Dropdown label="name" mode="multi" options={names} />
    </main>
  );
}
