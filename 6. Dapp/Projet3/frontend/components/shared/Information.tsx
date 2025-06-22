import VotersInformation from "./VotersInformation";
import ProposalsInformation from "./ProposalsInformation";
import Status from "./Status";
import WinnerInformation from "./WinnerInformation";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Information = () => {
	return (
		<div>
			<Tabs defaultValue="status">
				<TabsList>
					<TabsTrigger value="status">Status</TabsTrigger>
					<TabsTrigger value="voter">Voter</TabsTrigger>
					<TabsTrigger value="proposal">Proposal</TabsTrigger>
					<TabsTrigger value="winner">Winning Proposal</TabsTrigger>
				</TabsList>
				<TabsContent value="status">
					<Status />
				</TabsContent>
				<TabsContent value="voter">
					<VotersInformation />
				</TabsContent>
				<TabsContent value="proposal">
					<ProposalsInformation />
				</TabsContent>
				<TabsContent value="winner">
					<WinnerInformation />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default Information;