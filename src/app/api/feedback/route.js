import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request, response) {
  const feedbackData = await request.json();

  try {
    const docRef = await addDoc(collection(db, "feedback"), feedbackData);
    console.log("Feedback written with ID: ", docRef.id);
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ message: "Error", error: error });
  }

  return Response.json({ message: "Feedback sent succesfully" });
}
