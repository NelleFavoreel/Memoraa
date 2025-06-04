import React, { useState, useEffect } from "react";
import ChangingPassword from "../../components/account/ChangePassword";
import InfoForm from "../../components/account/InfoForm";
import AddFamilyMembers from "../../components/account/AddFamilyMembers";
import LogIn from "../login/LogIn";
import Underline from "../../components/button/Underline";
import "./Account.css";
import FullButton from "../../components/button/FullButton";
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
    <>
      <div className="background-color-account">
        <h1 className="title">Mijn account</h1>
        <div className="account-container">
          {isLoggedIn ? (
            <>
              <div className="account-info-container">
                <div className="account-info">
                  <InfoForm />
                  <div className="account-info-buttons">
                    <FullButton className="change-passord-button" type="button" onClick={() => setShowChangePassword(!showChangePassword)}>
                      Wachtwoord wijzigen?
                    </FullButton>
                    <div>{showChangePassword && <ChangingPassword onClose={() => setShowChangePassword(false)} />}</div>
                    <LogIn></LogIn>
                  </div>
                </div>
                <div className="account-family">
                  <div>
                    <AddFamilyMembers />
                  </div>
                </div>
              </div>
              {/* Latere feature */}
              {/* <div className="account-family-container">
              <div className="account-user-trips">
                <h2>Je geplande reizen</h2>
              </div>
            </div> */}
            </>
          ) : (
            <p>Je moet inloggen om toegang te krijgen tot je account.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Account;
