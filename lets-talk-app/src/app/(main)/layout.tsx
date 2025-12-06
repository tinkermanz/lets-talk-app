import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import LoginPage from "../(auth)/login/[[...login]]/page";
import StreamProvider from "@/providers/StreamProvider";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
	const user = await currentUser();

	if (!user) return <LoginPage />;

	return (
		<main className="animate-fade-in">
			<StreamProvider>{children}</StreamProvider>
		</main>
	);
};

export default MainLayout;
