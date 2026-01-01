const Introduction = () => {
  return (
    <section className='bg-cover bg-no-repeat'>
      <div className='space-y-3'>
        <div className='flex gap-2 text-2xl font-medium lg:text-3xl'>
          <h1>Hi, I'm Ilham</h1>{' '}
          <div className='ml-1 animate-waving-hand'>👋</div>
        </div>
        <div className='space-y-4'>
          <ul className='ml-5 flex list-disc flex-col gap-1 text-neutral-700 dark:text-neutral-400 lg:flex-row lg:gap-10'>
            <li>
              Semarang, Central Java <span className='ml-1'>🇮🇩</span>
            </li>
            <li>Student Staff UNNES TV</li>
          </ul>
        </div>
      </div>

      <p className='mt-6 leading-[1.8] text-neutral-800 dark:text-neutral-300 md:leading-loose'>
        Having a great interest in the world of videography, enjoying operating
        camera and capturing precious moments. In addition, also skilled in
        editing videos to create engaging content. I am now also a student staff
        at UNNES TV. Besides that, I also enjoy coding, from frontend to
        backend, especially in JavaScript.
      </p>
    </section>
  );
};

export default Introduction;
