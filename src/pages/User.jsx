import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
	doc,
	getDoc,
	getDocs,
	query,
	where,
	collection,
	updateDoc,
	arrayUnion,
	arrayRemove,
} from "firebase/firestore"
import { updateProfile } from "firebase/auth"
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage"
import { db, storage } from "../firebase"
import Post from "../components/Post"

export default function User({ user }) {
	const { userId } = useParams()

	const postCollectionsRef = collection(db, "posts")
	const storageRef = ref(storage, "profiles", userId)

	const [profile, setProfile] = useState(null)
	const [posts, setPosts] = useState([])
	const [followed, setFollowed] = useState(false)
	const docRef = doc(db, "users", userId)

	useEffect(() => {
		const getProfile = async () => {
			const docRef = doc(db, "users", userId)
			const docSnap = await getDoc(docRef)
			setProfile(docSnap.data())
		}

		getProfile()
	}, [])

	useEffect(() => {
		const getPosts = async () => {
			const q = query(postCollectionsRef, where("userId", "==", userId))
			const data = await getDocs(q)
			setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
		}
		getPosts()
	}, [profile])

	useEffect(() => {
		const handleSearch = async (id) => {
			const userDoc = doc(db, "users", id)
			const docSnap = await getDoc(userDoc)
			const followArray = docSnap.data().followers
			if (!followArray) return
			const isFollowed = followArray.filter((follow) => follow == user?.uid)
			if (isFollowed.length > 0) {
				setFollowed(true)
			}
		}

		handleSearch(userId)
	}, [followed])

	const handleFollow = async () => {
		if (!user) return alert("Please log in first")
		const followRef = doc(db, "users", userId)
		await updateDoc(followRef, {
			followers: arrayUnion(user.uid),
		})
		const userRef = doc(db, "users", user.uid)
		await updateDoc(userRef, {
			following: arrayUnion(userId),
		})
		setFollowed(true)
	}

	const handleUnfollow = async () => {
		const followRef = doc(db, "users", userId)
		await updateDoc(followRef, {
			followers: arrayRemove(user.uid),
		})
		const userRef = doc(db, "users", user.uid)
		await updateDoc(userRef, {
			following: arrayRemove(userId),
		})
		setFollowed(false)
	}

	const handleChange = async (e) => {
		if (e.target.files[0]) {
			await uploadBytesResumable(storageRef, e.target.files[0]).then(() => {
				getDownloadURL(storageRef).then(async (downloadURL) => {
					try {
						await updateProfile(user, {
							photoURL: downloadURL,
						})
						await updateDoc(docRef, {
							photoURL: downloadURL,
						})
					} catch (error) {
						console.log(error)
					}
				})
			})
		}
	}

	return (
		<div className="profile">
			<div className="profile__header">
				{user?.uid === userId ? (
					<div>
						<label htmlFor="profile__fileInput">
							<input
								type="file"
								onChange={handleChange}
								className="profile__fileInput"
								id="profile__fileInput"
								accept="image/png, image/gif, image/jpeg, image/avif"
							/>
							<img
								src={
									profile?.photoURL
										? profile.photoURL
										: "https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
								}
								className="profile__picture"
							/>
						</label>
					</div>
				) : (
					<img
						src={
							profile?.photoURL
								? profile.photoURL
								: "https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
						}
						className="profile__picture"
					/>
				)}

				<div className="profile__headerText">
					<h1>{profile?.displayName}</h1>
					<div className="profile__headerFollow">
						<Link to={`/user/${userId}/followers`}>
						<p>{profile?.followers.length} Followers</p>
						</Link>
						<Link to={`/user/${userId}/following`}>
							<p>{profile?.following.length} Following</p>
						</Link>
					</div>
					{user?.uid != userId ? (
						followed ? (
							<button
								className="profile__followButton"
								onClick={handleUnfollow}
							>
								Unfollow
							</button>
						) : (
							<button
								className="profile__followButton"
								onClick={handleFollow}
							>
								Follow
							</button>
						)
					) : (
						<></>
					)}
				</div>
			</div>
			<div className="profile__posts">
				{posts.map((post) => (
					<Post
						key={post.id}
						image={post.image}
						username={post.username}
						caption={post.caption}
						postId={post.id}
						user={user}
						userId={post.userId}
						likes={post.likes}
					/>
				))}
			</div>
		</div>
	)
}
