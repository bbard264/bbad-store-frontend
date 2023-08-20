import React from 'react';
import '../styles/components/LoadingScene.css';

export default function LoadingScene({ firstTime = false, login = false }) {
  return (
    <div className="postionLoadingScene">
      <div className="loadingScene">
        <div className="circleLine">
          <div className="box">
            <div className="circleLoading"></div>
          </div>
          <div className="box">
            <div className="circleLoading"></div>
          </div>
          <div className="box">
            <div className="circleLoading"></div>
          </div>
          <div className="box">
            <div className="circleLoading"></div>
          </div>
          <div className="box">
            <div className="circleLoading"></div>
          </div>
        </div>
        {firstTime ? (
          <div className="loadingText">Connecting to Server, take 1-3 mins</div>
        ) : (
          <></>
        )}
        {login ? (
          <div className="loadingText">Login User Infomation!</div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
