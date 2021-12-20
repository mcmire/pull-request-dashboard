import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';

/**
 * Component for the start page.
 *
 * @param {object} props - The props to this component.
 * @param {object} props.session - Information about the currently signed in
 * user.
 */
export default function StartPage({ session }) {
  const navigate = useNavigate();

  if (session != null) {
    navigate(ROUTES.PULL_REQUESTS);
  } else {
    navigate(ROUTES.SIGN_IN);
  }
}
