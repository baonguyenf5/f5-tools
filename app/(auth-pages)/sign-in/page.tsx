import { signInWithAzure } from "@/app/actions";
import { Message } from "@/components/form-message";
import { Button } from "@/components/ui/button";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
      <Button onClick={signInWithAzure}>Login with Microsoft</Button>
    </div>
  );
}
