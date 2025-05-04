import { FormMockInterview } from "@/components/form-mock-interview";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

export const CreateEditPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchInterview = async () => {
      if (!userId) {
        toast.error("Authentication required");
        return;
      }

      if (interviewId) {
        try {
          const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
          if (interviewDoc.exists()) {
            setInterview({
              id: interviewDoc.id,
              ...interviewDoc.data(),
            } as Interview);
          }
        } catch (error) {
          console.error("Error fetching interview:", error);
          toast.error("Failed to load interview");
        }
      }
    };

    fetchInterview();
  }, [interviewId, userId]);

  return (
    <div className="flex-col w-full my-4">
      <FormMockInterview initialData={interview} />
    </div>
  );
};
