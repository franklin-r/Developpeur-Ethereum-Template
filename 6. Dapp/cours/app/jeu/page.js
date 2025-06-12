"use client";		// Mandatory with useState

import { useState, useEffect } from "react";

const page = () => {

	const [number, setNumber] = useState(0);

	const increment = (inc) => {
		setNumber((prevNumber) => prevNumber + inc);
	}

	/*
	useEffect(() => {
		console.log("Page loaded");
	}, []);
	*/
	/*
	useEffect(() => {
		console.log("Page loaded");
	}, [number]);
	*/
	useEffect(() => {
		console.log("Page loaded");
	});

	return (
		<>
			<div>{number}</div>
			<button onClick={() => increment(2)}>Click!</button>
		</>
	)
}

export default page