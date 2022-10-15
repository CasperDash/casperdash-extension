import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ConfirmModal.scss';

export const ConfirmModal = ({ title = 'Are your sure?', description = '', buttonOkText = 'Yes', buttonCloseText = 'No', isOpen, onClose, onOk}) => {
  return (
      <Modal show={isOpen} onHide={onClose} className="cd_we_confirm-modal" >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {description}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            {buttonCloseText}
          </Button>
          <Button variant="primary" onClick={onOk}>
            {buttonOkText}
          </Button>
        </Modal.Footer>
      </Modal>
  );
}