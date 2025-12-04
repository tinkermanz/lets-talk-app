import { SignIn } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import Image from "next/image";

const LoginPage = () => {
	return (
		<main className="flex flex-col items-center p-5 gap-10 animat-fade-in">
			<section className="flex flex-col items-center">
				<Image
					width={100}
					height={100}
					src="/assets/logo.svg"
					alt="logo name"
				/>
				<h1 className="text-lg font-extrabold lg:text-2xl">
					Connect, Communicate, Collaborate in Real-Time
				</h1>
			</section>
			<div className="flex justify-center">
				<SignIn
					appearance={{
						theme: neobrutalism,
					}}
				/>
			</div>
		</main>
	);
};

export default LoginPage;
