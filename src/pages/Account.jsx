import React from "react";
import { useUserAuth } from "../components/UserAuth";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const Account = () => {

  const {user} = useUserAuth();

  return <div>{user?.email}</div>;
};

export default Account;
