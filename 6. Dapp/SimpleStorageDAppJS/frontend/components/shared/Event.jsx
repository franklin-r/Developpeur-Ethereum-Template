import { Card } from "../ui/card"
import { Badge } from "../ui/badge"

const Event = ({event}) => {
	return (
		<Card className="p-4 mb-2">
			<div className="flex items-center">
				<Badge className="bg-lime-500">NumberChanged</Badge>
				<p className="ml-2">Old Value: <span className="font-bold">{event.oldValue}</span></p>
				<p className="ml-2 mr-2"> </p>
				<p className="ml-2">New Value: <span className="font-bold">{event.newValue}</span></p>
			</div>
		</Card>
	)
}

export default Event