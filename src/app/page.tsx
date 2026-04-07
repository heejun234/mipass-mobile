import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login'); //
}

/* export default function Home() {
  return (
    <div className='flex flex-col flex-1 items-center justify-cente'>
      <main className='flex flex-1 w-full max-w-3xl flex-col items-center justify-between '>
        <p className='text-2xl font-bold '>test</p>
      </main>
    </div>
  );
} */
