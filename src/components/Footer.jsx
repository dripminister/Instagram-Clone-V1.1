import React from "react"
import HomeIcon from "@mui/icons-material/Home"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import { Link } from "react-router-dom"

export default function Footer({ user, setShowUpload }) {
	return (
		<div className="footer">
			<Link to="/">
				<div>
					<HomeIcon fontSize="large" />
				</div>
			</Link>
			<div>
				<SearchIcon fontSize="large" />
			</div>
			{user && (
				<div className="footer__icon">
					<AddIcon
						fontSize="large"
						onClick={() => setShowUpload(true)}
					/>
				</div>
			)}
			{user && (
				<Link to={`/user/${user.uid}`}>
					<div>
						<AccountCircleIcon fontSize="large" />
					</div>
				</Link>
			)}
		</div>
	)
}
