"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useReadContract, useWatchContractEvent } from "wagmi";
import { contractAbi, contractAddress, WorkflowStatus } from "@/constants";

type StatusContextType = {
  status: WorkflowStatus | null;
  isLoading: boolean;
};

export const StatusContext = createContext<StatusContextType>({
  status: null,
  isLoading: true
});

export const useStatusContext = () => useContext(StatusContext);

export const StatusProvider = ({ children }: { children: React.ReactNode }) => {
  
	const { address } = useAccount();
	const [status, setStatus] = useState<WorkflowStatus | null>(null);

  const { data, isPending, refetch } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "workflowStatus",
    account: address,
  });

  useEffect(() => {
    if (typeof data === "number") {
			setStatus(data);
		}
  }, [data]);

  useWatchContractEvent({
    address: contractAddress,
    abi: contractAbi,
    eventName: "WorkflowStatusChange",
    onLogs: () => {
      refetch();
    },
  });

  return (
    <StatusContext.Provider value={{ status, isLoading: isPending }}>
      {children}
    </StatusContext.Provider>
  );
}
