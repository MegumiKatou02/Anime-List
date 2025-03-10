import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/configs/firebase'
import type { User } from '@/types/discord'

export const createUserInFirestore = async (user: User) => {
  const userRef = doc(db, 'users', user.id)
  await setDoc(
    userRef,
    {
      id: user.id,
      username: user.global_name,
    },
    { merge: true },
  )
}

export const saveToFirestore = async (
  discordUserId: string,
  type: string,
  name: string,
  link: string,
  Id: string,
) => {
  try {
    const animeMangaRef = doc(db, `users/${discordUserId}/anime_manga/${Id}`)

    await setDoc(animeMangaRef, { type, name, link }, { merge: true })
  } catch (error) {
    console.error('Lỗi khi lưu vào Firestore:', error)
  }
}
