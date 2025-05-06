import React, { useState } from "react";

import ChangingPassword from "../components/account/ChangePassword";
import InfoForm from "../components/account/InfoForm";

function Account() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  return (
    <div>
      <h2>Account</h2>
      {/* <InfoForm></InfoForm> */}
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
