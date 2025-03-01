import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/configs/firebase'
import type { User } from '@/types/discord'

export const createUserInFirestore = async (user: User) => {
  const userRef = doc(db, 'users', user.id)
  await setDoc(
    userRef,
    {
      id: user.id,
      username: user.username,
    },
    { merge: true },
  )
}
