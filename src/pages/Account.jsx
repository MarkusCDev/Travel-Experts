import React from "react";
import { useUserAuth } from "../components/UserAuth";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const Account = () => {

  const {user} = useUserAuth();

  return <div>
    <div>{user?.email}</div>
  <table class="table">
  <thead>
    <tr>
      <th><abbr title="title">Title</abbr></th>
      <th>Image</th>
      <th><abbr title="description">Descrip.</abbr></th>
      <th><abbr title="button">Delete</abbr></th>
    </tr>
  </thead>
  <tbody>
    
    <tr>
      <th>1</th>
      <td>38</td>
      <td>23</td>
      <td>12</td>
    </tr>
  </tbody>
</table>
    </div>;
};

export default Account;
