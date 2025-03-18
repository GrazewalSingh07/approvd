import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

export const getUserOrders = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not signed in.");

  const uid = user.uid;
  try {
    const ordersCollectionRef = collection(db, "orders");
    const q = query(ordersCollectionRef, where("userId", "==", uid), orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return orders;
  } catch (error) {
    throw new Error({ error });
  }
};
