"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useStatusContext } from "@/contexts/StatusProvider";
import { WorkflowStatus } from "@/constants";

const Status = () => {

	const {status, isLoading} = useStatusContext();

	return (
		<Card className="text-center min-h-[200px]">
			<CardHeader>
				<CardTitle>Workflow Status</CardTitle>
			</CardHeader>
			<CardContent>
				<div>
					{isLoading ? (
						"Loading..."
					) : (
						WorkflowStatus[status as number]
					)}
				</div>
			</CardContent>
		</Card>
	)
}

export default Status;