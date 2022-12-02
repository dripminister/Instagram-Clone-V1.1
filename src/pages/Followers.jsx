import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../firebase"
import { doc, getDoc } from "firebase/firestore"

export default function Followers() {
	const { userId } = useParams()

	const [profile, setProfile] = useState(null)
	const [followers, setFollowers] = useState([])

	useEffect(() => {
		const getProfile = async () => {
			const docRef = doc(db, "users", userId)
			const docSnap = await getDoc(docRef)
			setProfile(docSnap.data())
		}

		getProfile()
	}, [])

	useEffect(() => {
		if (!profile) return
		setFollowers([])

		const getFollowers = () => {
			const data = []
			profile.followers.map(async (item) => {
				const docRef = doc(db, "users", item)
				const docSnap = await getDoc(docRef)
				data.push(docSnap.data())
				setFollowers((prev) => [...prev, docSnap.data()])
			})
		}

		getFollowers()
	}, [profile])

	return (
		<div className="following">
			<h1>{profile?.displayName} followers</h1>
			{followers ? (
				followers.map((item) => (
					<Link to={`/user/${item.uid}`}>
						<div
							className="following__listItem"
							key={item.uid}
						>
							<img
								src={
									item?.photoURL
										? item.photoURL
										: "https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
								}
								className="following__profilePicture"
							/>
							{item.displayName}
						</div>
					</Link>
				))
			) : (
				<h1>This user has no follower</h1>
			)}
		</div>
	)
}
