"use client";

import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCalls = () => {
	const { user } = useUser();
	const client = useStreamVideoClient();

	const [calls, setCalls] = useState<Call[]>();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const loadCalls = async () => {
			if (!client || !user?.id) return;
			setIsLoading(true);

			try {
				const { calls } = await client.queryCalls({
					sort: [
						{
							field: "starts_at", // start_time(latest first)
							direction: -1,
						},
					],
					filter_conditions: {
						starts_at: { $exists: true }, //call must have a start time
						$or: [
							{
								created_by_user_id: user.id, //User is the creator
							},
							{
								members: { $in: [user.id] }, // or user is a member of the call
							},
						],
					},
				});

				setCalls(calls);
			} catch (err) {
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};
		loadCalls();
	}, [client, user?.id]);

	const now = new Date();
	/* 
        Ended Calls that have either: 
            - Started before teh current time
            - Have endedAt timestamp (indicating the call has   ended)        
    */
	const endedCalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => {
		return (startsAt && new Date(startsAt) < now) || !!endedAt;
	});

	/* 
        upcomingCalls 
            Calls that start in the future
    */
	const upcomingCalls = calls?.filter(({ state: { startsAt } }: Call) => {
		return startsAt && new Date(startsAt) > now;
	});

	return { endedCalls, upcomingCalls, callRecordings: calls, isLoading };
};
