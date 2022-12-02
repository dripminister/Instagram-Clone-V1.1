import { useState } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import ImageUpload from "./components/ImageUpload"
import Home from "./pages/Home"
import User from "./pages/User"
import { Routes, Route } from "react-router-dom"
import Following from "./pages/Following"
import Followers from "./pages/Followers"

function App() {
	const [user, setUser] = useState(null)
	const [showUpload, setShowUpload] = useState(false)

	return (
		<div className="app">
			<Header
				user={user}
				setUser={setUser}
				setShowUpload={setShowUpload}
			/>
			<Routes>
				<Route
					path="/"
					element={<Home user={user} />}
				/>
				<Route
					path="/user/:userId"
					element={<User user={user} />}
				/>
				<Route
					path="/user/:userId/following"
					element={<Following user={user} />}
				/>
				<Route
					path="/user/:userId/followers"
					element={<Followers user={user} />}
				/>
			</Routes>
			<Footer
				user={user}
				setShowUpload={setShowUpload}
			/>
			{showUpload && (
				<ImageUpload
					user={user}
					setShowUpload={setShowUpload}
				/>
			)}
		</div>
	)
}

export default App
