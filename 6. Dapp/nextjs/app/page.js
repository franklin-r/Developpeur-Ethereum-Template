import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
    return (
        <Alert className="bg-pink-600">
            <AlertTitle className="font-mono font-bold text-white">Hello!</AlertTitle>
            <AlertDescription className="font-mono text-white">
                Welcome to this app!
            </AlertDescription>
        </Alert>
    );
}
