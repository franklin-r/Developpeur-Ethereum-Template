import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

import { AlertCircleIcon } from "lucide-react";

const NotConnected = () => {
  return (
    <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>You are not connected!</AlertTitle>
        <AlertDescription>
            Please connect your wallet to access the DApp.
        </AlertDescription>
    </Alert>
  );
}

export default NotConnected;