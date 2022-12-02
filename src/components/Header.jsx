import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import {
	createUserWithEmailAndPassword,
	updateProfile,
	signInWithEmailAndPassword,
	onAuthStateChanged,
    signOut
} from "firebase/auth"
import { auth, db } from "../firebase"
import { setDoc, doc } from "firebase/firestore"

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
	textAlign: "center",
}

export default function Header({user, setUser, setShowUpload }) {
	const [openSignUp, setOpenSignUp] = useState(false)
	const [openLogIn, setOpenLogIn] = useState(false)
	const [username, setUsername] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const handleSignUp = async (e) => {
		e.preventDefault()
		if(!username) return alert("Please enter your username")
		try {
			const res = await createUserWithEmailAndPassword(auth, email, password)
			setOpenSignUp(false)
			setDoc(doc(db, "users", res.user.uid), {
				uid: res.user.uid,
				displayName: username,
				email,
				photoURL: "",
				posts: [],
				saved: [],
				followers: [],
				following: []
			})
		} catch (err) {
			alert(err.message)
		}
	}

	const handleLogIn = async (e) => {
		e.preventDefault()
		try {
			const res = await signInWithEmailAndPassword(auth, email, password)
			setOpenLogIn(false)
		} catch (err) {
			alert(err.message)
		}
	}

	const handleLogOut = () => {
		signOut(auth)
		setShowUpload(false)
	}

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (authUser) => {
			if (authUser) {
				setUser(authUser)
				if (authUser.displayName) {
				} else {
					return updateProfile(authUser, {
						displayName: username,
					})
				}
			} else {
				setUser(null)
			}
		})

		return () => {
			unsub()
		}
	}, [user, username])

	return (
		<div className="header">
			<div>
				<img
					className="header__logo"
					src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					alt="logo"
				/>
			</div>
			{user && user.displayName}
			{user ? (
				<Button onClick={handleLogOut}>LOG OUT</Button>
			) : (
				<div>
					<Button onClick={() => setOpenSignUp(true)}>SIGN UP</Button>
					<Button onClick={() => setOpenLogIn(true)}>LOG IN</Button>
				</div>
			)}
			<Modal
				open={openSignUp}
				onClose={() => setOpenSignUp(false)}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography
						id="modal-modal-title"
						variant="h6"
						component="h2"
					>
						Sign up
					</Typography>
					<Typography
						id="modal-modal-description"
						sx={{ mt: 2 }}
					>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Username"
							className="header__input"
							required
						/>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
							className="header__input"
							required
						/>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							className="header__input"
							required
						/>
						<button
							className="header__button"
							onClick={handleSignUp}
						>
							Sign up
						</button>
					</Typography>
				</Box>
			</Modal>
			<Modal
				open={openLogIn}
				onClose={() => setOpenLogIn(false)}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography
						id="modal-modal-title"
						variant="h6"
						component="h2"
					>
						Log In
					</Typography>
					<Typography
						id="modal-modal-description"
						sx={{ mt: 2 }}
					>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
							className="header__input"
							required
						/>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							className="header__input"
							required
						/>
						<button
							className="header__button"
							onClick={handleLogIn}
						>
							Log In
						</button>
					</Typography>
				</Box>
			</Modal>
		</div>
	)
}
