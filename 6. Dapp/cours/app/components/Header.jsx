import Link from "next/link";

const Header = () => {
	return (
		<>
			<ul className="bg-lime-300 rounded-xl p-5">
				<li><Link href="/">Home</Link></li>
				<li><Link href="/cv">CV</Link></li>
				<li><Link href="/contact">Contact</Link></li>
			</ul>
		</>
	)
}

export default Header