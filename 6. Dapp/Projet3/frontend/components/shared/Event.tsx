"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { VoteEvent } from "./Voting";

const Event = ({ events }: { events: VoteEvent[] }) => {

		return (
			<>
				{!events.length ? (
					<Card className="text-center min-h-[200px]">
						<CardHeader>
							<CardTitle>List of Events</CardTitle>
						</CardHeader>
						<CardContent>
							<div>
								No events to display.
							</div>
						</CardContent>
					</Card>
				) : (
					<Card className="text-center min-h-[200px]">
						<CardHeader>
							<CardTitle>List of Events</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid w-full items-center gap-3">
								{events.map((event) => (
									<Card
										className="mb-1 p-5"
										key={`${event.blockNumber}-${event.type}`}
									>
										<div className="flex justify-between align-center">
											<Badge className={event.type === "VoterRegistered" ? "bg-blue-500" : 
																				event.type === "ProposalRegistered" ? "bg-purple-500" :
																				event.type === "Voted" ? "bg-green-500" : "bg-black"}>
												{event.type}
											</Badge>
											{event.voterAddr && (
												<p title="Voter Address: ">{event.voterAddr}</p>
											)}
											{event.proposalId && (
												<p title="Proposal ID: ">{event.proposalId}</p>
											)}
											{event.prevStatus && event.newStatus && (
												<div>
													<p title="Previous Status: ">{event.prevStatus}</p>
													<p title="New Status: ">{event.newStatus}</p>
												</div>
											)}
											<p title="Block: ">#{event.blockNumber}</p>
										</div>
									</Card>
								))}
							</div>
						</CardContent>
					</Card>
				)}
			</>
		)
}

export default Event;