import React, { useState } from 'react';
import AttendanceForm from './AttendanceForm';

const ParentComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Open Attendance Form</button>
      {isModalOpen && (
        <AttendanceForm onClose={handleCloseModal} hasCheckedIn={false} />
      )}
    </div>
  );
};

export default ParentComponent;
