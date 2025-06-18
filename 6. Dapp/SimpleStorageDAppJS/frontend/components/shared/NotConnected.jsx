import { AlertCircleIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const NotConnected = () => {
	return (
		<Alert variant="destructive">
			<AlertCircleIcon />
			<AlertTitle>You're not connected!</AlertTitle>
			<AlertDescription>
				Please connect your wallet to access the DApp.
			</AlertDescription>
		</Alert>
	)
}

export default NotConnected