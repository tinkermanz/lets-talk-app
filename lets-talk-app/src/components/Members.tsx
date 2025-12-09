"use client";

import { cn } from "@/lib/utils";
import { Call } from "@stream-io/video-react-sdk";
import Image from "next/image";
import { useEffect, useState } from "react";

type MembersProps = {
	call: Call;
};

const Members = ({ call }: MembersProps) => {
	if (!call) return;

	const [callMembers, setCallMembers] = useState<any[]>([]);

	useEffect(() => {
		const getMembers = async () => {
			const members = await call.queryMembers();
			setCallMembers(members.members);
		};
		getMembers();
	}, []);

	// If there are members in the call, render their avatars
	if (callMembers.length > 0) {
		return (
			<div className="relative flex w-full">
				{callMembers.map((member, index) => {
					const user = member.user;
					return (
						<Image
							key={user.id}
							src={user.image}
							alt="attendees"
							width={40}
							height={40}
							className={cn("rounded-full", { absolute: index > 0 })}
							style={{ top: 0, left: index * 28 }} // Position images in a stacked manner
						/>
					);
				})}

				{/* Show the total number of participants */}
				<div className="flex justify-center items-center absolute left-[136px] size-10 rounded-full border-[5px] border-gray-800 bg-gray-800 text-white shadow-2xl">
					{callMembers.length}
				</div>
			</div>
		);
	}
};

export default Members;
