import React, { useState } from 'react';
import FilterBar from './FilterBar';
import PullRequestList from './PullRequestList';
import SignOutButton from './SignOutButton';

/**
 * The page which appears when the user is signed in.
 *
 * @returns {JSX.Element} The JSX used to render this component.
 */
export default function DashboardPage() {
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
    <>
      <div className="flex justify-between mb-4">
        <FilterBar
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
        <SignOutButton />
      </div>
      <PullRequestList pullRequests={pullRequests} />
    </>
  );
}
