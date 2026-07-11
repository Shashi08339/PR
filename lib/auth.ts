import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Looks for /lib/auth.ts at your root

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };