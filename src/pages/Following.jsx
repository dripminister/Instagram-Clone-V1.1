import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../firebase"
import { doc, getDoc } from "firebase/firestore"

export default function Following() {
	const { userId } = useParams()

	const [profile, setProfile] = useState(null)
	const [following, setFollowing] = useState([])

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
        setFollowing([])

		const getFollowing = () => {
            const data = []
			profile.following.map(async (item) => {
				const docRef = doc(db, "users", item)
				const docSnap = await getDoc(docRef)
				data.push(docSnap.data())  
                setFollowing(prev => [...prev, docSnap.data()])
			})
		}

		getFollowing()
	}, [profile])


	return (
		<div className="following">
            <h1>{profile?.displayName} following</h1>
			{following ? (
				following.map((item) => (
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
				<h1>This user follows no one</h1>
			)}
		</div>
	)
}
