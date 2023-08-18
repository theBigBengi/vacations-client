import React from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import styles from "./Card.module.css";
import Button from "../Button";
import { useAuth } from "../../contexts/AuthContext";
import { useVacations } from "../../contexts/VacationsContext";

export default function CardHeader({ vacation, followers }: any) {
  const { user } = useAuth();
  const { followVacation, unfollowVacation } = useVacations();

  let isFollowing = followers.includes(user?.id);

  const handleClick = async () => {
    isFollowing
      ? unfollowVacation(vacation.id, user?.id)
      : followVacation(vacation, user?.id);
  };

  return (
    <button onClick={handleClick}>
      <span>{isFollowing ? <AiFillHeart /> : <AiOutlineHeart />}</span>
      {followers.length}
    </button>
  );
}
