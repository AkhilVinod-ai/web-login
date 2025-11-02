import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button, Heading, Flex, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function App() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  return (
    <View
      padding="2rem"
      backgroundColor="#f9fafb"
      borderRadius="16px"
      boxShadow="0 2px 10px rgba(0,0,0,0.1)"
    >
      <Heading level={2} textAlign="center" color="#333">
        Welcome, {user?.username || "User"} 👋
      </Heading>

      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap="1rem"
        marginTop="2rem"
      >
        <Button variation="primary" onClick={() => alert("Profile loaded!")}>
          View My Profile
        </Button>

        <Button variation="link" onClick={signOut}>
          Sign Out
        </Button>
      </Flex>
    </View>
  );
}

export default App;
