import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import LoginPage from "../(auth)/login/[[...login]]/page";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
	const user = await currentUser();

	if (!user) return <LoginPage />;

	return <main className="animate-fade-in">{children}</main>;
};

export default MainLayout;
