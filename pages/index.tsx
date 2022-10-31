import Head from 'next/head';
import { Heading, Center } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

function Home() {
  const { data: session } = useSession();

  const name = session?.user.profile.firstName;

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Center>
        <Heading size="lg">I am home page!</Heading>
      </Center>
    </>
  );
}

export default Home;
