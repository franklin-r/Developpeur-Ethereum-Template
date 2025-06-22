import { createContext, useContext } from "react";

import { WorkflowStatus } from "@/constants";

export type StatusContextType = {
  status: WorkflowStatus;
  isStatusPending: boolean;
	isStatusSuccess: boolean;
	refetchStatus: () => void;
};

export const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const useStatusContext = () => {
	const context = useContext(StatusContext);
	if (!context) {
		throw new Error("useStatusContext must be used within StatusContext.Provider");
	}
	return context;
};
