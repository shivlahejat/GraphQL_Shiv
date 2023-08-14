// pages/userdata.js

import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { useQuery, gql, useMutation } from "@apollo/client";
import client from "../../apollo-client";
import Head from "next/head";

const GET_USERS = gql`
  query {
    getUsers {
      _id
      firstName
      lastName
      email
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($_id: String!) {
    deleteUser(_id: $_id)
  }
`;

const UserData = () => {
  const { error, data } = useQuery(GET_USERS, { client });
  const [deleteUserMutation] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(false);

  const userData = data?.getUsers;
  const modalRef = useRef(null);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleShowDeleteConfirmation = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteUser(userToDelete._id);
    // setShowDeleteConfirmation(false);
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (field, value) => {
    setSelectedUser((prevField) => ({
      ...prevField,
      [field]: value,
    }));
  };

  const handleDeleteUser = async (_id) => {
    setLoading(true);
    try {
      const { data } = await deleteUserMutation({ variables: { _id } });
      if (data.deleteUser) {
        setStatusMessage({
          type: "success",
          message: "User deleted successfully.",
        });

        setTimeout(() => {
          setStatusMessage(null);
          setShowDeleteConfirmation(false);
        }, 2000);
      } else {
        setStatusMessage({ type: "error", message: "Error deleting user." });
      }
    } catch (error) {
      setStatusMessage({ type: "error", message: "Error deleting user." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>DISPLAY</title>
      </Head>
      <Container>
        <Div>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>First Name</TableHeader>
                <TableHeader>Last Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData?.map((user, index) => (
                <StyledTableRow key={user._id} index={index}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <BtnWrap>
                      {/* <Button onClick={() => handleOpenModal(user)}>
                        Update
                      </Button> */}
                      <BtnWrap>
                        <Button
                          red
                          onClick={() => handleShowDeleteConfirmation(user)}
                        >
                          Delete
                        </Button>
                      </BtnWrap>
                    </BtnWrap>
                  </TableCell>
                </StyledTableRow>
              ))}
              {error && <ErrorMessage>Error loading data.</ErrorMessage>}
            </TableBody>
          </Table>
        </Div>
      </Container>
      {showDeleteConfirmation && (
        <Overlay>
          <ModalContent>
            <Wrap>
              <p>Are you sure you want to delete this user?</p>
              <BtnWrap>
                <Button onClick={() => setShowDeleteConfirmation(false)}>
                  Cancel
                </Button>
                <Button red onClick={handleConfirmDelete}>
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
      )}
      {isModalOpen && selectedUser && (
        <Overlay>
          <ModalContent>
            <Wrap ref={modalRef}>
              <Flex onClick={handleCloseModal}>X</Flex>
              <InputContainer>
                <Input
                  value={selectedUser.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
                <Input
                  value={selectedUser.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
                <Input
                  value={selectedUser.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </InputContainer>
              <Button>{isUpdating ? "Updating..." : "Update"}</Button>

              {statusMessage && (
                <StatusMessage type={statusMessage.type}>
                  {statusMessage.message}
                </StatusMessage>
              )}
            </Wrap>
          </ModalContent>
        </Overlay>
      )}
    </>
  );
};

export default UserData;

const StatusMessage = styled.div`
  color: ${({ type }) => (type === "error" ? "#ff0000" : "#000")};
  font-size: 18px;
  font-family: "GilroyBold";
  text-align: center;
`;

const Flex = styled.div`
  width: 100%;
  justify-content: flex-end;
  display: flex;
  font-family: "GilroyBold";
  cursor: pointer;
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

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  width: 100%;
`;

const Input = styled.input`
  padding: 15px;
  border-radius: 10px;
  background: #f6f6f6;
  color: #14141f;
  border: 1px solid #e3e3e4;
  width: 100%;
  font-size: 15px;
  font-family: "GilroyBold";

  &:focus {
    outline-color: #1688fe;
  }

  &::placeholder {
    color: #595964;
  }
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
  background-color: rgb(69, 117, 238);
  width: 100px;
  font-family: "GilroySemiBold";

  ${({ red }) =>
    red &&
    css`
      background-color: #f00;
    `}
`;

const ErrorMessage = styled.div`
  color: #000;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  margin: 0;

  @media (min-width: 376px) {
    margin-left: 60px;
    min-width: calc(100% - 60px);
    max-width: calc(100% - 60px);
  }

  @media (max-width: 550px) {
    gap: 20px;
  }
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  padding: 10px;
  max-width: 1200px;
`;

const Table = styled.table`
  width: 100%;
  /* border-collapse: separate; */
  border-collapse: collapse;
`;
const TableRow = styled.tr`
  @media (max-width: 990px) {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid;
  }
`;

const TableHead = styled.thead`
  background: #4279f0;

  @media (max-width: 990px) {
    display: none;
  }
`;

const TableHeader = styled.th`
  padding: 20px;
  text-align: left;
  font-family: "GilroyBold";
  font-size: 20px;
  color: #000;
  border: 1px solid #000;
`;

const StyledTableRow = styled(TableRow)`
  background-color: ${(props) =>
    props.index % 2 === 0 ? "#f4f7f8" : "#d0d7e9"};

  @media (max-width: 990px) {
    background-color: ${(props) =>
      props.index % 2 != 0 ? "#f4f7f8" : "#d0d7e9"};
  }
`;

const TableBody = styled.tbody`
  @media (max-width: 990px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  font-size: 20px;
  width: calc(100% / 4);
  border: 1px solid #010101;

  ${({ capitalized }) =>
    capitalized &&
    css`
      text-transform: capitalize;
    `}

  @media (max-width: 990px) {
    font-family: "GilroySemiBold";
    font-size: 18px;
    padding: 7px 0;
    border: none;
    width: 100%;
  }

  @media (max-width: 325px) {
    font-size: 15px;
  }
`;
