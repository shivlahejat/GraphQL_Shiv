import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";

const DeleteModal = ({ onDelete, onClose, loading, statusMessage }) => {
  const modalRef = useRef(null);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Overlay>
      <ModalContent>
        <Wrap ref={modalRef}>
          <TitleText>Are you sure you want to delete this user?</TitleText>
          <Flex onClick={onClose}>X</Flex>
          <BtnWrap>
            <Button onClick={onClose}>Cancel</Button>
            <Button red onClick={onDelete}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </BtnWrap>
          {statusMessage && (
            <StatusMessage type={statusMessage.type}>
              {statusMessage.message}
            </StatusMessage>
          )}
        </Wrap>
      </ModalContent>
    </Overlay>
  );
};

export default DeleteModal;

const Flex = styled.div`
  position: absolute;
  cursor: pointer;
  right: 5px;
  top: 5px;
  font-family: GilroyBold;
`;

const StatusMessage = styled.div`
  color: ${({ type }) => (type === "error" ? "#ff0000" : "#000")};
  font-size: 18px;
  font-family: "GilroyBold";
  text-align: center;
`;

const TitleText = styled(StatusMessage)``;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(20 20 31 / 60%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BtnWrap = styled.div`
  display: flex;
  gap: 5px;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: Center;
  align-items: center;
  gap: 15px;
  background-color: #fff;
  max-height: 500px;
  width: 90%;
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  position: relative;
`;

const Button = styled.div`
  padding: 10px;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  background-color: rgb(69, 117, 238);
  width: 100px;
  font-family: "GilroySemiBold";

  ${({ red }) =>
    red &&
    css`
      background-color: #f00;
    `}
`;
