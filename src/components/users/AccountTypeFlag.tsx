import { AccountType, UserModel } from "@/core/model/user";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faHomeUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";

interface AccountTypeProps {
  user: UserModel;
}

/**
 * Flag component for indicating the account type of the given user.
 *
 * @param user user data to extract account type
 */
export const AccountTypeFlag = ({ user }: AccountTypeProps): ReactNode => {

  switch (user.accountType) {
    case AccountType.GITHUB:
      return <FontAwesomeIcon className="w-10 h-10 text-primary" icon={faGithub} />;
    case AccountType.GOOGLE:
      return <FontAwesomeIcon className="w-10 h-10 text-primary" icon={faGoogle} />;
    default:
      return <FontAwesomeIcon className="w-10 h-10 text-primary" icon={faHomeUser} />;
  }
}
