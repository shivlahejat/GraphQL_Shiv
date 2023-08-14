// src/pages/index.js

import NavBar from "@/imports/NavBar";
import Head from "next/head";
import React, { useState } from "react";
import styled from "styled-components";

const index = () => {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
  };
  const [field, setField] = useState(initialState);
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setField({ ...field, [name]: value });
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (!field.firstName || !field.lastName || !field.email) {
      setStatusMessage({ type: "error", message: "All fields are required" });
      setTimeout(() => {
        setStatusMessage(null);
      }, 2000);
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
            mutation AddUser($firstName: String!, $lastName: String!, $email: String!) {
              addUser(firstName: $firstName, lastName: $lastName, email: $email) {
               _id
               firstName
               lastName
               email
              }
            }
          `,
          variables: {
            firstName: field.firstName,
            lastName: field.lastName,
            email: field.email,
          },
        }),
      });

      const { data } = await response.json();
      setField(initialState);
      setStatusMessage({
        type: "success",
        message: "Data Inserted Successfully",
      });
      setLoading(false);
    } catch (error) {
      setStatusMessage({ type: "error", message: "Error Sending Data" });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatusMessage(null);
      }, 2000);
    }
  };

  return (
    <>
      <Head>
        <title>INSERT</title>
      </Head>
      <NavBar />
      <Wrap>
        <FormData>
          <InputWrap>
            <Input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={field.firstName}
              onChange={handleChange}
            />
            <Input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={field.lastName}
              onChange={handleChange}
            />
            <Input
              type="email"
              placeholder="Email"
              name="email"
              value={field.email}
              onChange={handleChange}
            />
          </InputWrap>
          <Button onClick={handleSubmit}>
            {loading ? "Sending..." : "Send"}
          </Button>
          {statusMessage && (
            <StatusMessage type={statusMessage.type}>
              {statusMessage.message}
            </StatusMessage>
          )}
        </FormData>
      </Wrap>
    </>
  );
};

export default index;

const StatusMessage = styled.div`
  color: ${({ type }) => (type === "error" ? "#ff0000" : "#000")};
  font-size: 18px;
  font-family: "GilroyBold";
  text-align: center;
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Button = styled.div`
  padding: 10px;
  background: #000;
  border-radius: 10px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  font-family: "GilroySemiBold";

  &:hover {
    background: rgb(33, 33, 33);
  }
`;

const FormData = styled.div`
  max-width: 450px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #dbdbdb;
  padding: 20px;
  border-radius: 10px;
`;

const Input = styled.input`
  padding: 10px;
  background: #fff;
  border: none;
  font-size: 18px;
  font-family: "GilroySemiBold";
  border-radius: 10px;

  &:focus {
    outline: none;
  }
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
