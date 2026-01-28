import React from 'react';

interface SectionHeadingProps {
  title: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ title }) => (
  <h2 className="font-bebas text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-8 tracking-wide border-l-4 sm:border-l-8 border-yellow-400 pl-4 sm:pl-6 uppercase italic">
    {title}
  </h2>
);
