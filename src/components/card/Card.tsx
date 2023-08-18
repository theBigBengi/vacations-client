import React from "react";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { IVacation } from "../../global/types";
import { useAuth } from "../../contexts/AuthContext";
import { useVacations } from "../../contexts/VacationsContext";
import Button from "../Button";

import styles from "./Card.module.css";

interface HeaderProps {
  vacation: IVacation;
  onEditClick: (id: number) => void;
  onRemoveClick: (id: number) => void;
  isAdmin: boolean;
  userId: number | undefined;
}

function formatDate(startingDate: string, endingDate: string) {
  return `${new Date(startingDate).toLocaleDateString()} - ${new Date(
    endingDate
  ).toLocaleDateString()}`;
}

function Header({
  vacation,
  onRemoveClick,
  onEditClick,
  isAdmin,
  userId,
}: HeaderProps) {
  const { destination, followers, id: vacationId, imgUrl } = vacation;
  const { followVacation, unfollowVacation } = useVacations();

  const isFollowing = followers?.includes(userId || 0);
  const followersCount = followers.length;
  const btnStyle = {
    ...(isFollowing && {
      color: "white",
      backgroundColor: "#f91880",
    }),
  };

  const handleFollowBtnClick = async () => {
    isFollowing
      ? unfollowVacation(vacationId, userId || 0)
      : followVacation(vacation, userId || 0);
  };

  const handleEditClick = async () => {
    onEditClick(vacationId);
  };

  const handleRemoveClick = async () => {
    onRemoveClick(vacation.id);
  };

  return (
    <div className={styles.cardHeader}>
      <img alt={destination} crossOrigin='anonymous' src={imgUrl} />
      <div className={`${styles.actions} ${isAdmin ? styles.admin : ""}`}>
        {isAdmin ? (
          <>
            <span onClick={handleEditClick}>
              <BsPencil />
            </span>
            <span onClick={handleRemoveClick}>
              <BsTrash3 />
            </span>
          </>
        ) : (
          <button onClick={handleFollowBtnClick} style={btnStyle}>
            <span>{isFollowing ? <AiFillHeart /> : <AiOutlineHeart />}</span>
            {followersCount}
          </button>
        )}
      </div>
      <div className={styles.imgOverlay} />
      <h4>{destination}</h4>
    </div>
  );
}

interface CardProps {
  vacation: IVacation;
  onEditClick: (id: number) => void;
  onRemoveClick: (id: number) => void;
}

function Card({ vacation, onRemoveClick, onEditClick }: CardProps) {
  const { endingDate, startingDate, description, price } = vacation;
  const { isAdmin, user } = useAuth();

  return (
    <div className={styles.card}>
      <Header
        onRemoveClick={onRemoveClick}
        onEditClick={onEditClick}
        vacation={vacation}
        isAdmin={isAdmin}
        userId={user?.id || undefined}
      />

      <div>
        <time>{formatDate(startingDate, endingDate)}</time>
        <p>{description}</p>

        <Button type='primary' disabled={isAdmin}>
          Buy Now - ${price}
        </Button>
      </div>
    </div>
  );
}

export default Card;
