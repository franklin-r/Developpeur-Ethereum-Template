"use client";

import Header from "./Header";
import Footer from "./Footer";

import { useAccount } from "wagmi";

const Layout = ({ children }: { children: React.ReactNode }) => {

	const {address} = useAccount();

  return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-grow p-5">
				{children}
			</main>
			<Footer />
		</div>
  )
}

export default Layout;