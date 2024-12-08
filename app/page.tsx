import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div>
      <h1>
        {session?.user
          ? "Authenticated as " + session.user.name
          : "Not authenticated"}
      </h1>
    </div>
  );
}
