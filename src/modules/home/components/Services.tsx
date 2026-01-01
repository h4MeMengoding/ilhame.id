import Router from 'next/router';
import { TbListDetails } from 'react-icons/tb';

import Button from '@/common/components/elements/Button';
import Card from '@/common/components/elements/Card';
import SectionHeading from '@/common/components/elements/SectionHeading';

const Services = () => {
  return (
    <section className='space-y-5'>
      <div className='space-y-3'>
        <SectionHeading title='Get to Know Me' />
        <p className='leading-[1.8] text-neutral-800 dark:text-neutral-300 md:leading-loose'>
          I invite you to get to know me better, like a book waiting to be
          opened, a story waiting to be told, and an adventure waiting to be
          explored together.
        </p>
      </div>
      <Card className='relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-8 shadow-xl'>
        {/* Animated background orbs */}
        <div className='absolute -left-20 -top-20 h-64 w-64 animate-pulse rounded-full bg-gradient-to-br from-purple-600 to-pink-600 opacity-10 blur-3xl'></div>
        <div
          className='absolute -bottom-20 -right-20 h-72 w-72 animate-pulse rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 opacity-10 blur-3xl'
          style={{ animationDelay: '1s', animationDuration: '4s' }}
        ></div>

        <div className='relative z-10 space-y-4'>
          <div className='flex items-center gap-2 text-white'>
            <TbListDetails size={24} />
            <h3 className='text-xl font-medium'>Open my about page!</h3>
          </div>
          <p className='pl-2 leading-[1.8] text-neutral-200 md:leading-loose'>
            I provide my Resume, Experience, Education, and Introduction in
            detail on that page.
          </p>
          <Button
            data-umami-event='Klik Tombol Tentang'
            onClick={() => Router.push('/about')}
          >
            Resume
          </Button>
        </div>
      </Card>
    </section>
  );
};

export default Services;
