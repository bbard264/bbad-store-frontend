import React from 'react';
import '../styles/components/LoadingScene.css';

export default function LoadingScene() {
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
      </div>
    </div>
  );
}
