import PropTypes from 'prop-types';

export const PullRequestType = PropTypes.shape({
  author: PropTypes.shape({
    login: PropTypes.string,
    avatarUrl: PropTypes.string.isRequired,
    orgLogins: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.instanceOf(Date).isRequired,
  priorityLevel: PropTypes.number.isRequired,
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  url: PropTypes.string.isRequired,
});
