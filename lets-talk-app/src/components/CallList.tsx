"use client";

import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Alert from "./Alert";
import { useRouter } from "next/navigation";
import MeetingCard from "./MeetingCard";

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
	const router = useRouter();
	const { endedCalls, upcomingCalls, callRecordings, isLoading } =
		useGetCalls();
	const [recordings, setRecordings] = useState<CallRecording[]>([]);
	const getCalls = () => {
		switch (type) {
			case "ended":
				return endedCalls;
			case "recordings":
				return recordings;
			case "upcoming":
				return upcomingCalls;
			default:
				return [];
		}
	};

	// Effect to fetch recordings when type is 'recordings'
	useEffect(() => {
		const fetchRecordings = async () => {
			const callData = await Promise.all(
				callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [] // Fetch recordings for each call
			);

			// Flatten and filter out empty recordings
			const recordings = callData
				.filter((call) => call.recordings.length > 0)
				.flatMap((call) => call.recordings);

			setRecordings(recordings); // Update recordings state
		};

		if (type === "recordings") {
			fetchRecordings(); // Fetch recordings only when type is 'recordings'
		}
	}, [type, callRecordings]);

	if (isLoading) return <Loading />;

	const calls = getCalls(); // Get relevant calls based on type

	// Render MeetingCards if calls exist
	if (calls && calls.length > 0)
		return (
			<div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
				{calls.map((meeting: Call | CallRecording) => {
					return (
						<MeetingCard
							call={meeting as Call} // Cast meeting as Call
							key={(meeting as Call).id} // Use call ID as key
							type={type} // Pass type prop
							icon={
								type === "ended"
									? "/assets/previous.svg" // Icon for ended calls
									: type === "recordings"
									? "/assets/recordings2.svg" // Icon for recordings
									: "/assets/upcoming.svg" // Icon for upcoming calls
							}
							title={
								(meeting as Call).state?.custom?.description || // Use custom description if available
								(meeting as CallRecording).filename?.substring(0, 20) || // Use recording filename if available
								"No Description" // Default title
							}
							date={
								(meeting as Call).state?.startsAt?.toLocaleString() || // Use start time if available
								(meeting as CallRecording).start_time?.toLocaleString() // Use recording start time if available
							}
							isPreviousMeeting={type === "ended"} // Indicate if meeting is previous
							link={
								type === "recordings"
									? (meeting as CallRecording).url // Use recording URL if type is recordings
									: `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
											(meeting as Call).id
									  }` // Construct meeting URL
							}
							buttonIcon1={
								type === "recordings" ? "/assets/play.svg" : undefined
							} // Use play icon for recordings
							buttonText={type === "recordings" ? "Play" : "Start"} // Use 'Play' for recordings, 'Start' otherwise
							handleClick={
								type === "recordings"
									? () => router.push(`${(meeting as CallRecording).url}`) // Navigate to recording URL
									: () => router.push(`/meeting/${(meeting as Call).id}`) // Navigate to meeting page
							}
						/>
					);
				})}
			</div>
		);

	return <Alert title="No calls available" iconUrl="/assets/no-calls.svg" />;
};

export default CallList;
