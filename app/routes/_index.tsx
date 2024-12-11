import type { Route } from "./+types/_index";

export default function Index(_: Route.ComponentProps) {
  return (
    <section>
      <h2 className="text-large">
        Welcome to another{" "}
        <a href="https://rovani.net" className="underline">
          Rovani.net
        </a>{" "}
        project
      </h2>
    </section>
  );
}
