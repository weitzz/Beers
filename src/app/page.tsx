import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Login from './login/page';



export default async function Home() {
  const session = await getServerSession();
  if (session) {
    redirect('/beer');
  }

  return (

    <Login />

  )
}
