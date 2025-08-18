import {
  SiAdobe,
  SiAdobeaftereffects,
  SiAdobeaudition,
  SiAdobephotoshop,
  SiAdobepremierepro,
  SiCanva,
  SiJavascript,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiWordpress,
} from 'react-icons/si';

export type stacksProps = {
  [key: string]: JSX.Element;
};

const iconSize = 20;

export const STACKS: stacksProps = {
  JavaScript: <SiJavascript size={iconSize} style={{ color: '#F7DF1E' }} />,
  TypeScript: <SiTypescript size={iconSize} style={{ color: '#3178C6' }} />,
  'Next.js': <SiNextdotjs size={iconSize} style={{ color: '#000000' }} />,
  'React.js': <SiReact size={iconSize} style={{ color: '#61DAFB' }} />,
  TailwindCSS: <SiTailwindcss size={iconSize} className='text-cyan-300' />,
  WordPress: <SiWordpress size={iconSize} />,
  Adobe: <SiAdobe size={iconSize} />,
  Canva: <SiCanva size={iconSize} style={{ color: '#00C4CC' }} />,
  'Adobe Premiere Pro': (
    <SiAdobepremierepro size={iconSize} style={{ color: '#9A9BFE' }} />
  ),
  'Adobe Audition': (
    <SiAdobeaudition size={iconSize} style={{ color: '#9A9BFE' }} />
  ),
  'Adobe After Effects': (
    <SiAdobeaftereffects size={iconSize} style={{ color: '#9A9BFE' }} />
  ),
  'Adobe Photoshop': (
    <SiAdobephotoshop size={iconSize} style={{ color: '#9A9BFE' }} />
  ),
};
