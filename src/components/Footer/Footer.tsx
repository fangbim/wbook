
import { Container, Text } from '@mantine/core';
import { kavoon } from '@/lib/fonts';
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";


const data = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Features', link: '#' },
      { label: 'How It Works', link: '#' },
      { label: 'Pricing', link: '#' },
      { label: 'Testimonials', link: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', link: '#' },
      { label: 'Contact Us', link: '#' },
      { label: 'Privacy Policy', link: '#' },
      { label: 'Terms of Service', link: '#' },
    ],
  },
];

export function Footer() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text
        key={index}
        component="a"
        href={link.link}
        onClick={(event) => event.preventDefault()}
        className="text-sm sm:text-base hover:text-gray-300 transition-colors duration-200 py-1"
      >
        {link.label}
      </Text>
    ));

    return (
      <div className='w-full sm:w-40 flex flex-col gap-2 sm:gap-3' key={group.title}>
        <Text fw={700} className='opacity-80 text-base sm:text-lg font-semibold mb-2'>
          {group.title}
        </Text>
        <div className="flex flex-col gap-1 sm:gap-2">
          {links}
        </div>
      </div>
    );
  });

  return (
    <footer className='w-full bg-[#45474B] text-white py-8 sm:py-10 lg:py-12'>
      <Container size="xl" className='px-4 sm:px-6 lg:px-8'>
        {/* Main Footer Content */}
        <div className='flex flex-col lg:flex-row justify-between gap-8 lg:gap-12'>
          {/* Brand Section */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className={`${kavoon.className} text-3xl sm:text-4xl lg:text-5xl font-bold mb-2`}>
              WBook
            </h1>
            <Text size="sm" c="dimmed" className="text-sm sm:text-base opacity-70">
              Organize. Track. Remember.
            </Text>
          </div>
          
          {/* Links Section */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 w-full lg:w-auto lg:flex lg:flex-row'>
            {groups}
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className='flex flex-col gap-4 pt-6 sm:pt-8'>
          {/* Divider */}
          <div className='w-full h-[1px] bg-white opacity-30'></div>
          
          {/* Copyright and Social */}
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6'>
            {/* Copyright */}
            <Text size="sm" className="text-xs sm:text-sm text-center sm:text-left opacity-80">
              © {new Date().getFullYear()} WBook. All rights reserved.
            </Text>
            
            {/* Social Icons */}
            <div className='flex items-center gap-4 sm:gap-6'>
              <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6 hover:text-pink-400 transition-colors duration-200 cursor-pointer" />
              <FaXTwitter className="w-5 h-5 sm:w-6 sm:h-6 hover:text-blue-400 transition-colors duration-200 cursor-pointer" />
              <FaFacebook className="w-5 h-5 sm:w-6 sm:h-6 hover:text-blue-600 transition-colors duration-200 cursor-pointer" />
              <FaTiktok className="w-5 h-5 sm:w-6 sm:h-6 hover:text-red-400 transition-colors duration-200 cursor-pointer" />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}