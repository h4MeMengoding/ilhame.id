import { BiRocket as ContactIcon } from 'react-icons/bi';
import {
  BsEnvelopeAtFill as EmailIcon,
  BsGithub as GithubIcon,
  BsInstagram as InstagramIcon,
  BsLinkedin as LinkedinIcon,
  BsTwitter as TwitterIcon,
} from 'react-icons/bs';
import {
  FiCoffee as ProjectIcon,
  FiCpu as DashboardIcon,
  FiEdit3 as BlogIcon,
  FiImage as GalleryIcon,
  FiPieChart as AnalyticsIcon,
  FiPocket as HomeIcon,
  FiUser as ProfileIcon,
} from 'react-icons/fi';
import { HiStatusOnline as StatusIcon } from 'react-icons/hi';
import { PiChatCircleDotsBold as ChatIcon } from 'react-icons/pi';
import { SiBetterstack } from 'react-icons/si';

import { MenuItemProps } from '../types/menu';

const iconSize = 20;

export const MENU_ITEMS: MenuItemProps[] = [
  {
    title: 'Home',
    href: '/',
    icon: <HomeIcon size={iconSize} />,
    isShow: true,
    isExternal: false,
    eventName: 'Pages: Home',
    type: 'Pages',
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <DashboardIcon size={iconSize} />,
    isShow: true,
    isExternal: false,
    eventName: 'Pages: Dashboard',
    type: 'Pages',
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: <ProjectIcon size={iconSize} />,
    isShow: true,
    isExternal: false,
    eventName: 'Pages: Projects',
    type: 'Pages',
  },
  {
    title: 'Gallery',
    href: '/gallery',
    icon: <GalleryIcon size={iconSize} />,
    isShow: true,
    isExternal: false,
    eventName: 'Pages: Gallery',
    type: 'Pages',
  },
  {
    title: 'Blog',
    href: '/blog',
    icon: <BlogIcon size={iconSize} />,
    isShow: true,
    isExternal: false,
    eventName: 'Pages: Blog',
    type: 'Pages',
  },
  // {
  //   title: 'Learn',
  //   href: '/learn',
  //   icon: <LearnIcon size={iconSize} />,
  //   isShow: true,
  //   isExternal: false,
  //   eventName: 'Pages: Learn',
  //   type: 'Pages',
  // },
  {
    title: 'About',
    href: '/about',
    icon: <ProfileIcon size={iconSize} />,
    isShow: true,
    isExternal: false,
    eventName: 'Pages: About',
    type: 'Pages',
  },
  {
    title: 'Contact',
    href: '/contact',
    icon: <ContactIcon size={iconSize} />,
    isShow: true,
    isExternal: false,
    eventName: 'Pages: Contact',
    type: 'Pages',
  },
  {
    title: 'Chat',
    href: '/guestbook',
    icon: <ChatIcon size={iconSize} />,
    isShow: true,
    isExternal: false,
    eventName: 'Pages: Chat',
    type: 'Pages',
  },
  {
    title: 'Status',
    href: '/status',
    icon: <StatusIcon size={iconSize} />,
    isShow: true,
    isExternal: false,
    eventName: 'Pages: Status',
    type: 'Pages',
  },
];

export const MENU_APPS: MenuItemProps[] = [
  // {
  //   title: 'JS Playground',
  //   href: '/playground',
  //   icon: <SiJavascript size={iconSize} />,
  //   isShow: true,
  //   isExternal: false,
  //   eventName: 'Pages: Playground',
  //   type: 'Pages',
  // },
];

export const SOCIAL_MEDIA: MenuItemProps[] = [
  {
    title: 'Email',
    href: 'mailto:ilhamshofaa@gmail.com',
    icon: <EmailIcon size={iconSize} />,
    isShow: true,
    isExternal: true,
    eventName: 'Contact: Email',
    className: '!bg-green-600 border border dark:border-neutral-700',
    type: 'Link',
  },

  {
    title: 'Linkedin',
    href: 'https://www.linkedin.com/in/ilhamshofa/',
    icon: <LinkedinIcon size={iconSize} />,
    isShow: true,
    isExternal: true,
    eventName: 'Social: Linkedin',
    className: '!bg-blue-500 border border dark:border-neutral-700',
    type: 'Link',
  },
  {
    title: 'Twitter',
    href: 'https://twitter.com/ilhamontwt',
    icon: <TwitterIcon size={iconSize} />,
    isShow: true,
    isExternal: true,
    eventName: 'Social: Twitter',
    className: '!bg-sky-500 border border dark:border-neutral-700',
    type: 'Link',
  },
  {
    title: 'Instagram',
    href: 'https://instagram.com/ilham.shff',
    icon: <InstagramIcon size={iconSize} />,
    isShow: true,
    isExternal: true,
    eventName: 'Social: Instagram',
    className: '!bg-orange-700 border border dark:border-neutral-700',
    type: 'Link',
  },
  {
    title: 'Github',
    href: 'https://github.com/h4MeMengoding',
    icon: <GithubIcon size={iconSize} />,
    isShow: true,
    isExternal: true,
    eventName: 'Social: Github',
    className: '!bg-black border border dark:border-neutral-700',
    type: 'Link',
  },
];

export const EXTERNAL_LINKS: MenuItemProps[] = [
  {
    title: 'Analitik',
    href: 'https://analytics.hame.my.id/share/4ABtbrzlELYCOaK8/ilhame.id',
    icon: <AnalyticsIcon size={iconSize} />,
    isShow: true,
    isExternal: true,
    eventName: 'External Link: Analytics',
    type: 'Link',
  },
  {
    title: 'Uptime',
    href: 'https://status.hame.my.id',
    icon: <SiBetterstack size={iconSize} />,
    isShow: true,
    isExternal: true,
    eventName: 'External Link: Uptime',
    type: 'Link',
  },
];
