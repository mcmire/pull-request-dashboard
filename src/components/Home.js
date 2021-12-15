import React, { useState } from 'react';
import FilterBar from './FilterBar';
import PullRequestList from './PullRequestList';

/**
 * The component for the home (main) screen.
 *
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function Home() {
  const [selectedFilters, setSelectedFilters] = useState({
    creator: ['me'],
    status: [],
  });
  const [pullRequests] = useState([
    {
      isCreatedByMetaMaskian: true,
      authors: ['NiranjanaBinoy', 'jpuri', 'georgewrmarshall'],
      number: '13090',
      title: 'Subject metadata cleanup',
      createdAt: new Date(2021, 11, 1, 17, 5, 0),
      priorityLevel: 2,
      statuses: [
        'hasMergeConflicts',
        'hasRequiredChanges',
        'hasMissingTests',
        'isBlocked',
      ],
    },
    {
      isCreatedByMetaMaskian: false,
      authors: ['ImGelu'],
      number: '13054',
      title: 'Updated all Romanian Translations',
      createdAt: new Date(2021, 11, 11, 8, 18, 0),
      priorityLevel: 1,
      statuses: ['hasMissingTests'],
    },
  ]);

  return (
    <div className="p-4">
      <FilterBar
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
      <PullRequestList pullRequests={pullRequests} />
    </div>
  );
}
