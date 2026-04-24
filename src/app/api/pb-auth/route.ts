import { type RecordModel } from "pocketbase";
import { env } from "@/env";
import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/db";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;

    await db
      .collection("_superusers")
      .authWithPassword(
        env.POCKETBASE_SERVER_EMAIL,
        env.POCKETBASE_SERVER_PASSWORD,
      );

    // 3. Find or create PB user
    let user;

    try {
      user = await db
        .collection("users")
        .getFirstListItem(`clerkId="${userId}"`);
    } catch {
      if (!email)
        return Response.json(
          {
            error:
              "Clerk user does not have an email address! Cannot create PB user.",
          },
          { status: 500 },
        );

      user = await db.collection("users").create({
        clerkId: userId,
        clerkEmail: email,
        verified: true,
        role: "unassigned",
        password: env.POCKETBASE_SERVER_PASSWORD,
        passwordConfirm: env.POCKETBASE_SERVER_PASSWORD,
      });
    }

    // 4. Log in as that user (IMPORTANT)
    const authData = await db
      .collection("users")
      .authWithPassword(user.clerkId, env.POCKETBASE_SERVER_PASSWORD);

    // 5. Return PB token
    return Response.json({ token: authData.token, user: authData.record });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export interface IPBAuth {
  token: string;
  user: RecordModel;
}
