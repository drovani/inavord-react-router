import type { MetaFunction } from "@netlify/remix-runtime";

export const meta: MetaFunction = () => {
  return [
    { title: "Hero Wars Helper: Heroes" },
    { name: "description", content: "A helper app for Hero Wars: Alliance mobile game" },
  ];
};

export default function Index() {
  return (
    <h1>The Heroes</h1>
  );
}
