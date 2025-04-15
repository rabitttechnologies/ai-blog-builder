
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SearchSectionHeaderProps {
  heading: string;
  description: string;
}

const SearchSectionHeader = ({ heading, description }: SearchSectionHeaderProps) => (
  <CardHeader>
    <CardTitle>{heading}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
);

export default SearchSectionHeader;
