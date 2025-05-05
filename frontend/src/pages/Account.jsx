import ChangingPassword from "../components/ChangePassword";
import React, { useState } from "react";

function Account() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  return (
    <div>
      <h2>Account</h2>
      <p>Comming soon... 👉</p>
      <div>
        <button type="button" onClick={() => setShowChangePassword(!showChangePassword)}>
          Wachtwoord wijzigen?
        </button>

        {showChangePassword && <ChangingPassword onClose={() => setShowChangePassword(false)} />}
      </div>
    </div>
  );
}

export default Account;
