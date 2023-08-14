// src/imports/UpdateModal.js

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const UpdateModal = ({ user, onClose, refetchUserData }) => {
  const modalRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

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

  const handleUpdate = async () => {
    if (!updatedUser.firstName || !updatedUser.lastName || !updatedUser.email) {
      setStatusMessage({
        type: "error",
        message: "All fields should have a value.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation UpdateUser($_id: String!, $firstName: String!, $lastName: String!, $email: String!) {
              updateUser(_id: $_id, firstName: $firstName, lastName: $lastName, email: $email) {
                _id
                firstName
                lastName
                email
              }
            }
          `,
          variables: {
            _id: user._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
          },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        setStatusMessage({ type: "error", message: data.errors[0].message });
      } else {
        setStatusMessage({
          type: "success",
          message: "User updated successfully.",
        });
        setTimeout(() => {
          setStatusMessage(null);
          onClose();
        }, 2000);
        refetchUserData();
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setStatusMessage({ type: "error", message: "Error updating user." });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <ModalContent>
        <Wrap ref={modalRef}>
          <TitleText>Update User</TitleText>
          <Flex onClick={onClose}>X</Flex>

          <InputContainer>
            <Input
              type="text"
              name="firstName"
              value={updatedUser.firstName}
              onChange={handleChange}
            />
            <Input
              type="text"
              name="lastName"
              value={updatedUser.lastName}
              onChange={handleChange}
            />
            <Input
              type="email"
              name="email"
              value={updatedUser.email}
              onChange={handleChange}
            />
          </InputContainer>

          <BtnWrap>
            <Button onClick={onClose}>Close</Button>
            <Button update onClick={handleUpdate}>
              {loading ? "Updating.." : " Update"}
            </Button>
          </BtnWrap>
          <StatusMessage type={statusMessage?.type}>
            {statusMessage?.message}
          </StatusMessage>
        </Wrap>
      </ModalContent>
    </Overlay>
  );
};

export default UpdateModal;

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

const TitleText = styled.div`
  color: #000;
  text-align: center;
  font-size: 18px;
  font-family: "GilroyBold";
  text-transform: capitalize;
`;

const BtnWrap = styled.div`
  display: flex;
  gap: 5px;
`;

const Button = styled.div`
  padding: 10px;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  width: 100px;
  font-family: "GilroySemiBold";
  background: ${({ update }) => (update ? "#4caf50" : "rgb(69, 117, 238)")};

  &:hover {
    background: ${({ update }) => (update ? "#4bbc50" : "#6d90e9")};
  }
`;

const Input = styled.input`
  padding: 15px;
  border-radius: 10px;
  background: #f6f6f6;
  color: #14141f;
  border: 1px solid #e3e3e4;
  width: 100%;
  font-size: 15px;
  font-family: "GilroySemiBold";

  &:focus {
    outline-color: #1688fe;
  }

  &::placeholder {
    color: #595964;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  width: 100%;
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
