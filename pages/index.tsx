import Head from 'next/head';
import { Heading, Center, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

function Home() {
  const { data: session } = useSession();

  const name = session?.user?.profile?.firstName;

  const welcomeMsg = name ? `Welcome, ${name}` : 'Welcome!';

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Center>
        <Heading size="lg">I am home page!</Heading>
        <Text>{welcomeMsg}</Text>
      </Center>
    </>
  );
}

export default Home;
