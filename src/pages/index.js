// src/pages/index.js
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setField({ ...field, [name]: value });
  };

  const handleClick = () => {
    const { firstName, lastName, email } = field;
    alert(`First Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}`);
    setField(initialState);
  };

  return (
    <>
      <Head>
        <title>Graphql</title>
      </Head>
      <Wrap>
        <FormData>
          <InputWrap>
            <Input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={field.firstName}
              onChange={handleChange}
              required
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
          <Button onClick={handleClick}>Submit</Button>
        </FormData>
      </Wrap>
    </>
  );
};

export default index;

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
  background: #ccc;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 10px;
  background: #fff;
  border: none;
  font-size: 18px;
  font-family: "Gilroy";
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
