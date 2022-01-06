import React from 'react';
import classnames from 'classnames';
import SyncIcon from '../images/icons/octicons/sync-16.svg';

type Props = {
  refreshPullRequests: () => void;
  arePullRequestsLoading: boolean;
};

/**
 * Component that renders a button used to refresh the pull request list.
 *
 * @param props - The props to this component.
 * @param props.refreshPullRequests - Function to refresh the pull requests
 * list.
 * @param props.arePullRequestsLoading - Whether the pull request list is being
 * loaded right now.
 * @returns The JSX used to render this component.
 */
export default function RefreshButton({
  refreshPullRequests,
  arePullRequestsLoading,
}: Props) {
  return (
    <a
      href="#"
      onClick={refreshPullRequests}
      className={classnames({
        'text-gray-300 cursor-not-allowed animate-spin': arePullRequestsLoading,
        'text-gray-500 hover:text-blue-500': !arePullRequestsLoading,
      })}
    >
      <SyncIcon className="h-[1em]" />
    </a>
  );
}
