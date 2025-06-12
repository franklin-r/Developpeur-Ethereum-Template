"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const page = () => {

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get("https://dumbstockapi.com/stock?exchanges=NYSE");
				setData(response.data);
				setLoading(false);
			}
			catch(error) {
				console.error(error);
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	return (
		<>
			{loading ? 
				(
					<p>Loading...</p>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
						{data && 
							data.map((item) => {
								return (
									<div key={item.ticker} className="border rounded-lg p-20 shadow-md hover:shadow-lg transition-shadow duration-300">
                  	<h2 className="text-xl font-semibold">{item.name}</h2>
										<p className="text-gray-600">Ticker: {item.ticker}</p>
									</div>
								)
							})
						}
					</div>
				)
			}
		</>
	)
}

export default page