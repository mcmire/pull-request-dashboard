import PropTypes from 'prop-types';

export const PullRequestType = PropTypes.shape({
  // isCreatedByMetaMaskian: PropTypes.bool.isRequired,
  // authorAvatarUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  author: PropTypes.shape({
    login: PropTypes.string,
    avatarUrl: PropTypes.string.isRequired,
    teamLogins: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.instanceOf(Date).isRequired,
  priorityLevel: PropTypes.number.isRequired,
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  url: PropTypes.string.isRequired,
});
