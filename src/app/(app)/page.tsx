import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="flex justify-center items-center h-screen"
    >
      <Button>Log Out</Button>
    </form>
  );
};

export default HomePage;
