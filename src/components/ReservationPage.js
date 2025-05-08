// src/pages/ReservationPage.js
import { useLocation } from 'react-router-dom';
import ReservationFlow from '../components/ReservationFlow';

const ReservationPage = () => {
  const { state } = useLocation();
  
  if (!state?.propertyDetails) {
    return <div>Error: No reservation data found. Please start your reservation from the property page.</div>;
  }

  return (
    <div className="reservation-page-container">
      <ReservationFlow propertyDetails={state.propertyDetails} />
    </div>
  );
};

export default ReservationPage;