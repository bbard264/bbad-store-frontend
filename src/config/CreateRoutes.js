import React from 'react';
import ConfigRoute from './routes';
import { Navigate, Routes, Route } from 'react-router-dom';

function CreateRoutes(props) {
  const role = props.role || 'guest';
  const { publicRoutes, privateRoutes, redirectRoute } = ConfigRoute.route;
  const { allowedRoutes, redirectRoute: roleRedirectRoute } =
    ConfigRoute.role[role];

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/" />} />
      {publicRoutes.map((route) => (
        <Route
          path={route.url}
          key={route.url}
          element={
            <route.component
              setRole={props.setRole}
              shareState={props.shareState}
              setShareState={props.setShareState}
            />
          }
        />
      ))}
      {privateRoutes.map((route) => (
        <Route
          path={route.url}
          key={route.url}
          element={
            allowedRoutes.includes(route) ? (
              <route.component
                setRole={props.setRole}
                shareState={props.shareState}
                setShareState={props.setShareState}
              />
            ) : (
              <Navigate to={roleRedirectRoute} replace />
            )
          }
        />
      ))}
      <Route path="*" element={<Navigate to={redirectRoute} />} />
    </Routes>
  );
}

export default CreateRoutes;
