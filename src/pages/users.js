// src/pages/users.js

import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { useQuery, gql, useMutation } from "@apollo/client";
import client from "../../apollo-client";
import Head from "next/head";
import DeleteModal from "@/imports/DeleteModal";
import NavBar from "@/imports/NavBar";
import UpdateModal from "@/imports/UpdateModal";
import { useRouter } from "next/router";

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
  const { error, data, refetch } = useQuery(GET_USERS, { client });
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const userData = data?.getUsers;
  const modalRef = useRef(null);

  const [deleteUserMutation] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userUpdate, setUserUpdate] = useState(null);

  useEffect(() => {
    refetch();
  }, []);

  const handleUpdateModal = (user) => {
    setUserUpdate(user);
    setShowUpdateModal(true);
  };

  const handleDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteUser(userToDelete._id);
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

  const handleRedirect = () => {
    router.push("/");
  };

  // console.log(userData);

  return (
    <>
      <Head>
        <title>CRUD OPERATION</title>
      </Head>
      <NavBar />
      <Container>
        <Div>
          {userData?.length > 0 ? (
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
                        <Button green onClick={handleRedirect}>
                          Insert
                        </Button>
                        <Button onClick={() => handleUpdateModal(user)}>
                          Update
                        </Button>
                        <Button red onClick={() => handleDeleteModal(user)}>
                          Delete
                        </Button>
                      </BtnWrap>
                    </TableCell>
                  </StyledTableRow>
                ))}
                {error && <ErrorMessage>Error loading data.</ErrorMessage>}
              </TableBody>
            </Table>
          ) : (
            <p>Data Not Found</p>
          )}
        </Div>
      </Container>
      {showDeleteConfirmation && (
        <DeleteModal
          onDelete={handleConfirmDelete}
          onClose={() => setShowDeleteConfirmation(false)}
          loading={loading}
          statusMessage={statusMessage}
        />
      )}
      {showUpdateModal && userUpdate && (
        <UpdateModal
          user={userUpdate}
          onClose={() => setShowUpdateModal(false)}
          refetchUserData={refetch}
        />
      )}
    </>
  );
};

export default UserData;

const BtnWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
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

  &:hover {
    background: ${({ red }) => (!red ? "#6d90e9" : "#f55")};
  }

  ${({ red }) =>
    red &&
    css`
      background-color: #f00;
    `}

  ${({ green }) =>
    green &&
    css`
      background-color: #4caf50;
    `}

    &:hover {
    ${({ green }) =>
      green &&
      css`
        background-color: #4bbc50;
      `}
  }
`;

const ErrorMessage = styled.div`
  color: #000;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 60px;
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  padding: 10px;

  scrollbar-color: transparent transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
`;

const Table = styled.table`
  width: 100%;
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
  width: calc(100% / 5);
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
