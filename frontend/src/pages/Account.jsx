import React, { useState, useEffect } from "react";
import ChangingPassword from "../components/account/ChangePassword";
import InfoForm from "../components/account/InfoForm";
import AddFamilyMembers from "../components/account/AddFamilyMembers";
import LogIn from "./login/LogIn";
function Account() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>
      <h2>Account</h2>
      {isLoggedIn ? (
        <>
          <InfoForm />
          <AddFamilyMembers />
          <div>
            <button type="button" onClick={() => setShowChangePassword(!showChangePassword)}>
              Wachtwoord wijzigen?
            </button>

            {showChangePassword && <ChangingPassword onClose={() => setShowChangePassword(false)} />}
          </div>
          <LogIn></LogIn>
        </>
      ) : (
        <p>Je moet inloggen om toegang te krijgen tot je account.</p>
      )}
    </div>
  );
}

export default Account;
